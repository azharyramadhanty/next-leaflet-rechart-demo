import DatePicker from 'react-datepicker';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { DatepickerType } from '@/utils/enums/DatepickerEnum';

type BaseDatePickerProps = {
  type: DatepickerType;
  id?: string;
  selected: Date | [Date | null, Date | null] | null;
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
  showMonthYearPicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  isClearable?: boolean;
  placeholder?: string;
  maxRangeMonth?: number;
  className?: string;
}

const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  type,
  id,
  selected,
  onChange,
  minDate,
  showMonthYearPicker = false,
  maxDate,
  placeholder,
  isClearable = true,
  dateFormat = "MM/yyyy",
  maxRangeMonth,
  className
}) => {
  const [max, setMax] = useState<Date | null>(null);

  const handleDateChange = (dates: Date | [Date | null, Date | null] | null) => {
    if (type === DatepickerType.RANGE) {
      const [start, end] = dates as [Date | null, Date | null]
      if (start) {
        const maxEndDate = new Date(start)
        maxEndDate.setMonth(maxEndDate.getMonth() + maxRangeMonth)

        let endMonth = end
        if (end) endMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0);
        setMax(maxEndDate);
        onChange([start, endMonth])
        return;
      }
    }

    onChange(dates)
  };

  return (
    <div id={id} className="relative w-full flex justify-end">
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        {...(type === DatepickerType.RANGE
          ? {
              selectsRange: true,
              startDate: selected ? (selected as [Date | null, Date | null])[0] : null,
              endDate: selected ? (selected as [Date | null, Date | null])[1] : null,
            }
          : {
              selected: selected as Date,
            })
        }
        onChange={handleDateChange}
        minDate={minDate}
        // maxDate={max || maxDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        showMonthYearPicker={showMonthYearPicker}
        isClearable={isClearable}
        dateFormat={dateFormat}
        className={className}
        portalId="root"
        icon={
          <Image src={'assets/calender-icon.svg'} alt={'calender logo'} width={0} height={0} style={{width: 'auto'}} />
        }
      />
    </div>
  );
};

type DatePickerProps = {
  type: DatepickerType;
  selected: Date | [Date | null, Date | null] | null;
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  maxRangeMonth?: number;
  isClearable?: boolean;
  dateFormat?: string;
  className?: string;
};

export const Datepicker: React.FC<DatePickerProps> = (props: DatePickerProps) => {
  switch (props.type) {
    case DatepickerType.SINGLE:
      return <BaseDatePicker {...props} />;
    case DatepickerType.RANGE:
      return <BaseDatePicker {...props} showMonthYearPicker id="datepicker-range" className="text-[10px] w-full font-medium font-[nunito] text-gray-900 border border-gray-300 rounded-2xl inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />;
    default:
      const _exhaustiveCheck = props.type;
      throw new Error(`Unhandled type: ${_exhaustiveCheck}`);
  }
};

export default Datepicker