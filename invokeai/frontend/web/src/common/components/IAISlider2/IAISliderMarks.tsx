import { SliderMark, SystemStyleObject } from '@chakra-ui/react';
import { MotionProps, motion } from 'framer-motion';
import { memo, useMemo } from 'react';

export type IAISliderMarksProps = {
  marks: number[];
  formatValue: (v: number) => string;
};

const initial: MotionProps['initial'] = { opacity: 0, y: 10 };

const animate: MotionProps['animate'] = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.2, ease: 'easeOut' },
};

const exit: MotionProps['exit'] = {
  opacity: 0,
  y: 10,
  transition: { duration: 0.2, ease: 'anticipate' },
};

const initialOther = { ...initial, x: '-50%' };
const animateOther = { ...animate, x: '-50%' };
const exitOther = { ...exit, x: '-50%' };

const firstMarkStyle: SystemStyleObject = {
  insetInlineStart: '0 !important',
  insetInlineEnd: 'unset !important',
};

const lastMarkStyle: SystemStyleObject = {
  insetInlineStart: 'unset !important',
  insetInlineEnd: '0 !important',
};

const isNumberArray = (
  marks: IAISliderMarksProps['marks']
): marks is number[] => {
  return typeof marks[0] === 'number';
};

const IAISliderMarks = ({
  marks: _marks,
  formatValue,
}: IAISliderMarksProps) => {
  const marks = useMemo<{ value: number; label: string }[]>(() => {
    if (isNumberArray(_marks)) {
      return _marks.map((m) => ({ value: m, label: formatValue(m) }));
    }
    return _marks;
  }, [_marks, formatValue]);
  return (
    <>
      {marks.map((m, i) => {
        if (i === 0) {
          return (
            <SliderMark
              as={motion.div}
              initial={initial}
              animate={animate}
              exit={exit}
              key={m.value}
              value={m.value}
              sx={firstMarkStyle}
            >
              {m.label}
            </SliderMark>
          );
        } else if (i === marks.length - 1) {
          return (
            <SliderMark
              as={motion.div}
              initial={initial}
              animate={animate}
              exit={exit}
              key={m.value}
              value={m.value}
              sx={lastMarkStyle}
            >
              {m.label}
            </SliderMark>
          );
        } else {
          return (
            <SliderMark
              as={motion.div}
              initial={initialOther}
              animate={animateOther}
              exit={exitOther}
              key={m.value}
              value={m.value}
            >
              {m.label}
            </SliderMark>
          );
        }
      })}
    </>
  );
};

export default memo(IAISliderMarks);
