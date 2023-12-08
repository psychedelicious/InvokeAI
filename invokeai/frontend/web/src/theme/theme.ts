import { ThemeOverride, ToastProviderProps } from '@chakra-ui/react';
import { headingTheme } from 'theme/components/heading';
import { InvokeAIColors } from './colors/colors';
import { accordionTheme } from './components/accordion';
import { buttonTheme } from './components/button';
import { checkboxTheme } from './components/checkbox';
import { editableTheme } from './components/editable';
import { formTheme } from './components/form';
import { formLabelTheme } from './components/formLabel';
import { inputTheme } from './components/input';
import { menuTheme } from './components/menu';
import { modalTheme } from './components/modal';
import { numberInputTheme } from './components/numberInput';
import { popoverTheme } from './components/popover';
import { progressTheme } from './components/progress';
import { no_scrollbar } from './components/scrollbar';
import { selectTheme } from './components/select';
import { skeletonTheme } from './components/skeleton';
import { sliderTheme } from './components/slider';
import { switchTheme } from './components/switch';
import { tabsTheme } from './components/tabs';
import { textTheme } from './components/text';
import { textareaTheme } from './components/textarea';
import { tooltipTheme } from './components/tooltip';
import { reactflowStyles } from './custom/reactflow';

export const theme: ThemeOverride = {
  config: {
    cssVarPrefix: 'invokeai',
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  layerStyles: {
    body: { bg: 'base.900', color: 'base.50' },
    first: { bg: 'base.850', color: 'base.100' },
    second: { bg: 'base.800', color: 'base.100' },
    third: { bg: 'base.750', color: 'base.100' },
    nodeBody: { bg: 'base.800', color: 'base.100' },
    nodeHeader: { bg: 'base.900', color: 'base.100' },
    nodeFooter: { bg: 'base.900', color: 'base.100' },
  },
  styles: {
    global: () => ({
      body: { bg: 'base.900', color: 'base.50' },
      '*': { ...no_scrollbar },
      ...reactflowStyles,
    }),
  },
  direction: 'ltr',
  fonts: {
    body: "'Inter Variable', sans-serif",
    heading: "'Inter Variable', sans-serif",
  },
  shadows: {
    accent: '0 0 10px 0 var(--invokeai-colors-accent-600)',
    accentHover: '0 0 10px 0 var(--invokeai-colors-accent-500)',
    ok: '0 0 7px var(--invokeai-colors-ok-400)',
    working: '0 0 7px var(--invokeai-colors-working-400)',
    error: '0 0 7px var(--invokeai-colors-error-400)',
    selected:
      '0px 0px 0px 1px var(--invokeai-colors-base-900), 0px 0px 0px 4px var(--invokeai-colors-accent-500)',
    hoverSelected:
      '0px 0px 0px 1px var(--invokeai-colors-base-900), 0px 0px 0px 4px var(--invokeai-colors-accent-400)',
    hoverUnselected:
      '0px 0px 0px 1px var(--invokeai-colors-base-900), 0px 0px 0px 3px var(--invokeai-colors-accent-400)',
    nodeSelected: '0 0 0 3px var(--invokeai-colors-accent-500)',
    nodeHovered: '0 0 0 2px var(--invokeai-colors-accent-400)',
    nodeHoveredSelected: '0 0 0 3px var(--invokeai-colors-accent-400)',
    nodeInProgress:
      '0 0 0 2px var(--invokeai-colors-yellow-400), 0 0 20px 2px var(--invokeai-colors-orange-700)',
  },
  colors: InvokeAIColors,
  components: {
    Button: buttonTheme, // Button and IconButton
    Input: inputTheme,
    Editable: editableTheme,
    Textarea: textareaTheme,
    Tabs: tabsTheme,
    Progress: progressTheme,
    Accordion: accordionTheme,
    FormLabel: formLabelTheme,
    Switch: switchTheme,
    NumberInput: numberInputTheme,
    Select: selectTheme,
    Skeleton: skeletonTheme,
    Slider: sliderTheme,
    Popover: popoverTheme,
    Modal: modalTheme,
    Checkbox: checkboxTheme,
    Menu: menuTheme,
    Text: textTheme,
    Tooltip: tooltipTheme,
    Heading: headingTheme,
    Form: formTheme,
  },
};

export const TOAST_OPTIONS: ToastProviderProps = {
  defaultOptions: { isClosable: true, position: 'bottom-right' },
};
