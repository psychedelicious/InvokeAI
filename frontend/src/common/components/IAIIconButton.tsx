import {
  IconButtonProps,
  IconButton,
  Tooltip,
  TooltipProps,
  forwardRef,
} from '@chakra-ui/react';

export type IAIIconButtonProps = IconButtonProps & {
  styleClass?: string;
  tooltip?: string;
  tooltipProps?: Omit<TooltipProps, 'children'>;
  asCheckbox?: boolean;
  isChecked?: boolean;
};

const IAIIconButton = forwardRef((props: IAIIconButtonProps, forwardedRef) => {
  const {
    tooltip = '',
    styleClass,
    tooltipProps,
    asCheckbox,
    isChecked,
    ...rest
  } = props;

  return (
    <Tooltip label={tooltip} hasArrow {...tooltipProps}>
      <IconButton
        ref={forwardedRef}
        className={
          styleClass
            ? `invokeai__icon-button ${styleClass}`
            : `invokeai__icon-button`
        }
        data-as-checkbox={asCheckbox}
        data-selected={isChecked !== undefined ? isChecked : undefined}
        {...rest}
      />
    </Tooltip>
  );
});

export default IAIIconButton;
