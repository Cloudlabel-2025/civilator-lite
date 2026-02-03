import React, { useEffect } from "react";
import Utils from "../../helpers/utils";

interface SliderInputProps {
  id?: string;
  label?: string;
  value: number;
  max: number;
  min: number;
  min_value?: number;
  unit?: string;
  setValue: (value: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  id = Utils.getUniqueId(),
  value = 0,
  label = "",
  max = 100,
  min = 0,
  unit = "",
  setValue,
}) => {
  useEffect(() => {
    const parent_div = document.getElementById(`slider-input-${id}`) as any;

    if (!parent_div) return;

    const slider_input = parent_div.querySelector(
        "#task-update-slider_input"
      ) as HTMLInputElement,
      slider_value = parent_div.querySelector(
        "#task-update-range-value"
      ) as HTMLDivElement,
      slider_thumb = parent_div.querySelector(
        "#task-update-slider_thumb"
      ) as HTMLDivElement,
      slider_line = parent_div.querySelector(
        "#task-update-slider_line"
      ) as HTMLDivElement;

    const showSliderValue = () => {
      let _value =
        (parseFloat(slider_input.value) / parseFloat(slider_input.max)) * 100;

      if (value > parseFloat(slider_input.value)) return;

      setValue(parseFloat(slider_input.value));

      slider_value.innerHTML = `(${slider_input.value} ${unit || ""})`;

      const bulletPosition =
          parseFloat(slider_input.value) / parseFloat(slider_input.max),
        space = slider_input.offsetWidth - slider_thumb.offsetWidth;

      slider_thumb.style.left = bulletPosition * space + "px";
      slider_line.style.width = _value + "%";
    };

    window.addEventListener("resize", showSliderValue);
    slider_input.addEventListener("input", showSliderValue, false);

    slider_input.value = value.toString();
    showSliderValue();

    return () => {
      window.removeEventListener("resize", showSliderValue);
      slider_input.removeEventListener("input", showSliderValue, false);
    };
  }, [unit]);

  return (
    <div id={`slider-input-${id}`} className="w-full flex flex-col ">
      <div className="w-full flex items-center justify-between">
        {label && <span className="text-md">{label}</span>}
        {unit && <span>({unit})</span>}
      </div>
      <div className="w-full flex items-center gap-2">
        <div className="task-update-range-slider">
          <div
            id="task-update-slider_thumb"
            className="task-update-range-slider_thumb"
          ></div>
          <div className="task-update-range-slider_line">
            <div
              id="task-update-slider_line"
              className="task-update-range-slider_line-fill"
            ></div>
          </div>
          <input
            id="task-update-slider_input"
            className="task-update-range-slider_input"
            type="range"
            defaultValue={value}
            min={min}
            max={max}
          />
        </div>

        <label className="task-update-range-value" id="task-update-range-value">
          -
        </label>
      </div>
    </div>
  );
};
