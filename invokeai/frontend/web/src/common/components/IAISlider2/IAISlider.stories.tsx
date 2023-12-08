import type { Meta, StoryObj } from '@storybook/react';
import IAISlider from 'common/components/IAISlider2/IAISlider';
import { useCallback, useState } from 'react';

const meta: Meta<typeof IAISlider> = {
  title: 'IAISlider',
  tags: ['autodocs'],
  component: IAISlider,
  args: {
    label: 'My Value',
    min: 0,
    max: 10,
    step: 1,
    marks: [0, 5, 10],
  },
};

export default meta;
type Story = StoryObj<typeof IAISlider>;

const Component = (props: Parameters<typeof IAISlider>[0]) => {
  const [value, setValue] = useState(0);
  return <IAISlider {...props} value={value} onChange={setValue} />;
};

const ComponentWithReset = (props: Parameters<typeof IAISlider>[0]) => {
  const [value, setValue] = useState(0);
  const onReset = useCallback(() => {
    setValue(0);
  }, []);
  return (
    <IAISlider {...props} value={value} onChange={setValue} onReset={onReset} />
  );
};

export const WithInput: Story = {
  render: Component,
  args: {
    withInput: true,
  },
};

export const WithTooltip: Story = {
  render: Component,
  args: {
    withTooltip: true,
  },
};

export const WithFormattedValues: Story = {
  render: Component,
  args: {
    withTooltip: true,
    formatValue: (v: number) => `${v} eggs`,
  },
};

export const WithReset: Story = {
  render: ComponentWithReset,
};

export const FloatValue: Story = {
  render: Component,
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    marks: [0, 0.5, 1],
  },
};

export const WithFineStep: Story = {
  render: Component,
  args: {
    label: 'My Value (hold shift!)',
    fineStep: 0.1,
  },
};
