import type { ComboboxOnChange, ComboboxOption } from '@invoke-ai/ui-library';
import type { EntityState } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/store/storeHooks';
import type { GroupBase } from 'chakra-react-select';
import type { ModelIdentifierWithBase } from 'features/nodes/types/common';
import { groupBy, map, reduce } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyModelConfig } from 'services/api/types';

type UseGroupedModelComboboxArg<T extends AnyModelConfig> = {
  modelEntities: EntityState<T, string> | undefined;
  selectedModel?: ModelIdentifierWithBase | null;
  onChange: (value: T | null) => void;
  getIsDisabled?: (model: T) => boolean;
  isLoading?: boolean;
};

type UseGroupedModelComboboxReturn = {
  value: ComboboxOption | undefined | null;
  options: GroupBase<ComboboxOption>[];
  onChange: ComboboxOnChange;
  placeholder: string;
  noOptionsMessage: () => string;
};

export const useGroupedModelCombobox = <T extends AnyModelConfig>(
  arg: UseGroupedModelComboboxArg<T>
): UseGroupedModelComboboxReturn => {
  const { t } = useTranslation();
  const base_model = useAppSelector((s) => s.generation.model?.base ?? 'sdxl');
  const { modelEntities, selectedModel, getIsDisabled, onChange, isLoading } = arg;
  const options = useMemo<GroupBase<ComboboxOption>[]>(() => {
    if (!modelEntities) {
      return [];
    }
    const modelEntitiesArray = map(modelEntities.entities);
    const groupedModels = groupBy(modelEntitiesArray, 'base');
    const _options = reduce(
      groupedModels,
      (acc, val, label) => {
        acc.push({
          label,
          options: val.map((model) => ({
            label: model.name,
            value: model.key,
            isDisabled: getIsDisabled ? getIsDisabled(model) : false,
          })),
        });
        return acc;
      },
      [] as GroupBase<ComboboxOption>[]
    );
    _options.sort((a) => (a.label === base_model ? -1 : 1));
    return _options;
  }, [getIsDisabled, modelEntities, base_model]);

  const value = useMemo(
    () =>
      options.flatMap((o) => o.options).find((m) => (selectedModel ? m.value === selectedModel.key : false)) ?? null,
    [options, selectedModel]
  );

  const _onChange = useCallback<ComboboxOnChange>(
    (v) => {
      if (!v) {
        onChange(null);
        return;
      }
      const model = modelEntities?.entities[v.value];
      if (!model) {
        onChange(null);
        return;
      }
      onChange(model);
    },
    [modelEntities?.entities, onChange]
  );

  const placeholder = useMemo(() => {
    if (isLoading) {
      return t('common.loading');
    }

    if (options.length === 0) {
      return t('models.noModelsAvailable');
    }

    return t('models.selectModel');
  }, [isLoading, options, t]);

  const noOptionsMessage = useCallback(() => t('models.noMatchingModels'), [t]);

  return { options, value, onChange: _onChange, placeholder, noOptionsMessage };
};
