#!/bin/bash

skip_frontend_checks=false

handle_options() {
    while [ $# -gt 0 ]; do
        case $1 in
        --skip_frontend_checks)
            skip_frontend_checks=true
            ;;
        *)
            echo "Invalid option: $1" >&2
            usage
            exit 1
            ;;
        esac
        shift
    done
}

handle_options "$@"

set -e

BCYAN="\e[1;36m"
BYELLOW="\e[1;33m"
BGREEN="\e[1;32m"
BRED="\e[1;31m"
RED="\e[31m"
RESET="\e[0m"

function is_bin_in_path {
    builtin type -P "$1" &>/dev/null
}

function git_show {
    git show -s --format='%h %s' $1
}

cd "$(dirname "$0")"

# Some machines only have `python3` in PATH, others have `python` - make an alias.
# We can use a function to approximate an alias within a non-interactive shell.
if ! is_bin_in_path python && is_bin_in_path python3; then
    function python {
        python3 "$@"
    }
fi

if [[ -v "VIRTUAL_ENV" ]]; then
    # we can't just call 'deactivate' because this function is not exported
    # to the environment of this script from the bash process that runs the script
    echo -e "${BRED}A virtual environment is activated. Please deactivate it before proceeding.${RESET}"
    exit -1
fi

VERSION=$(
    cd ..
    python -c "from invokeai.version import __version__ as version; print(version)"
)

echo -e "${BGREEN}HEAD${RESET}:"
git_show
echo

# ---------------------- FRONTEND ----------------------

pushd ../invokeai/frontend/web >/dev/null
echo
echo "Installing frontend dependencies..."
echo
pnpm i --frozen-lockfile
echo
echo "Building frontend..."
if [ "$skip_frontend_checks" = true ]; then
    echo -e "${BYELLOW}Skipping frontend checks...${RESET}"
    pnpm vite build
else
    pnpm build
fi
echo
popd

# ---------------------- BACKEND ----------------------

echo
echo "Building wheel..."
echo

# install the 'build' package in the user site packages, if needed
# could be improved by using a temporary venv, but it's tiny and harmless
if [[ $(python -c 'from importlib.util import find_spec; print(find_spec("build") is None)') == "True" ]]; then
    pip install --user build
fi

rm -rf ../build

python -m build --wheel --outdir dist/ ../.

# ----------------------

echo
echo "Building installer zip files for InvokeAI ${VERSION}..."
echo

# get rid of any old ones
rm -f *.zip
rm -rf InvokeAI-Installer

# copy content
mkdir InvokeAI-Installer
for f in templates *.txt *.reg; do
    cp -r ${f} InvokeAI-Installer/
done
mkdir InvokeAI-Installer/lib
cp lib/*.py InvokeAI-Installer/lib

# Move the wheel
mv dist/*.whl InvokeAI-Installer/lib/

# Install scripts
# Mac/Linux
cp install.sh.in InvokeAI-Installer/install.sh
chmod a+x InvokeAI-Installer/install.sh

# Windows
perl -p -e "s/^set INVOKEAI_VERSION=.*/set INVOKEAI_VERSION=$VERSION/" install.bat.in >InvokeAI-Installer/install.bat
cp WinLongPathsEnabled.reg InvokeAI-Installer/

FILENAME=InvokeAI-installer-$VERSION.zip

# Zip everything up
zip -r $FILENAME InvokeAI-Installer

# clean up
rm -rf InvokeAI-Installer tmp dist ../invokeai/frontend/web/dist/

# Set the output variable for github action
echo "INSTALLER_FILENAME=$FILENAME" >>$GITHUB_OUTPUT
echo "INSTALLER_PATH=installer/$FILENAME" >>$GITHUB_OUTPUT

exit 0
