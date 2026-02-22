import { type ReactNode, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner.component";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import { useValidationMessage, type ValidationRule } from "@/hooks/use-validation-message/useValidationMessage.hook";
import { useOnClickOutside } from "@/hooks/use-on-click-outside/useOnClickOutside.hook";
import { useDropdownPosition } from "@/hooks/use-dropdown-position/useDropdownPosition.hook";
import { useDictionary } from "@/locales";
import { Icon } from "../icon/Icon.component";
import { Tooltip } from "../tooltip/Tooltip.component";
import { Input } from "../input/Input.component";
import { Checkbox } from "../checkbox/Checkbox.component";
import { selectLocale } from "./Select.component.locales";
import type { Css } from "@/runtime/css.types";
import "./Select.component.css";

export interface SelectOption<Value extends string = string> {
  label: ReactNode;
  value: Value;
  disabled?: boolean;
}

type SelectEventHandlers = {
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOut?: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
};

interface SelectBaseProps<Value extends string = string> extends SelectEventHandlers {
  name: string;
  id: string;
  label: string;
  options: SelectOption<Value>[];
  validate?: ValidationRule[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  clearable?: boolean;
  searchable?: boolean;
  className?: string;
  css?: Css;
  inputCss?: Css;
  inputClassName?: string;
  containerOptionsCss?: Css;
}

interface SelectSingleProps<Value extends string = string> extends SelectBaseProps<Value> {
  multiple?: false;
  value?: Value;
  onChange?: (value: Value) => void;
  onSelect?: (value: Value) => void;
}

interface SelectMultipleProps<Value extends string = string> extends SelectBaseProps<Value> {
  multiple: true;
  value?: Value[];
  onChange?: (value: Value[]) => void;
  onSelect?: (value: Value, selected: boolean) => void;
}

type SelectProps<Value extends string = string> = SelectSingleProps<Value> | SelectMultipleProps<Value>;

function getTextFromNode(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextFromNode((node.props as { children?: ReactNode }).children);
  }
  return "";
}

export function Select<Value extends string = string>(props: SelectProps<Value>) {
  const {
    label,
    validate,
    options,
    id,
    loading,
    disabled,
    className,
    css: cssProp,
    inputCss,
    inputClassName,
    containerOptionsCss,
    placeholder,
    clearable,
    searchable,
    name,
    required,
    multiple,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    onTouchStart,
    onTouchEnd,
  } = props;

  const displayEventHandlers = {
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    onTouchStart,
    onTouchEnd,
  };

  const dictionary = useDictionary(selectLocale);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const [singleValue, setSingleValue] = useState("" as Value);
  const [multipleValues, setMultipleValues] = useState<Value[]>([]);

  const containerRef = useRef<HTMLLabelElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const { position, computePosition, reset: resetPosition } = useDropdownPosition({ ref: containerRef });

  const { validationMessage, setInvalid, checkValidity } = useValidationMessage();

  const selectedValues = multiple ? (props.value ?? multipleValues) : [];
  const selectedValue = multiple ? "" : (props.value ?? singleValue);

  const isControlled = props.value !== undefined;

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => getTextFromNode(opt.label).toLowerCase().includes(query));
  }, [options, searchQuery]);

  const close = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    resetPosition();
  }, [resetPosition]);

  useOnClickOutside({ ref: containerRef, handler: close, active: open });

  useEffect(() => {
    if (focusedIndex >= 0) {
      const items = optionsContainerRef.current?.querySelectorAll<HTMLDivElement>(".select-option:not(.disabled)");
      items?.[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  function triggerNativeValidation() {
    if (selectRef.current) {
      checkValidity(selectRef.current, validate);
    }
  }

  function handleToggle() {
    if (disabled || loading) return;
    if (open) {
      close();
    } else {
      computePosition();
      setOpen(true);
      if (searchable) {
        requestAnimationFrame(() => {
          const input = containerRef.current?.querySelector<HTMLInputElement>(".select-search-row input");
          input?.focus();
        });
      }
    }
  }

  function handleOptionClick(option: SelectOption<Value>) {
    if (option.disabled) return;

    if (multiple) {
      const current = isControlled ? ((props as SelectMultipleProps<Value>).value ?? []) : multipleValues;
      const isAlreadySelected = current.includes(option.value);
      const next = isAlreadySelected ? current.filter((v) => v !== option.value) : [...current, option.value];
      if (!isControlled) setMultipleValues(next);
      (props as SelectMultipleProps<Value>).onChange?.(next);
      (props as SelectMultipleProps<Value>).onSelect?.(option.value, !isAlreadySelected);
      requestAnimationFrame(triggerNativeValidation);
    } else {
      if (!isControlled) setSingleValue(option.value);
      (props as SelectSingleProps<Value>).onChange?.(option.value);
      (props as SelectSingleProps<Value>).onSelect?.(option.value);
      requestAnimationFrame(triggerNativeValidation);
      close();
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    if (multiple) {
      if (!isControlled) setMultipleValues([]);
      (props as SelectMultipleProps<Value>).onChange?.([]);
    } else {
      if (!isControlled) setSingleValue("" as Value);
      (props as SelectSingleProps<Value>).onChange?.("" as Value);
    }
    requestAnimationFrame(triggerNativeValidation);
  }

  function isOptionSelected(value: Value) {
    return multiple ? selectedValues.includes(value) : selectedValue === value;
  }

  function getDisplayContent(): ReactNode {
    if (multiple) {
      const selected = options.filter((opt) => selectedValues.includes(opt.value));
      if (selected.length === 0) return <span className={mergeClass("select-display-text", "placeholder")}>{placeholder}</span>;
      return <span className='select-display-text'>{selected.map((opt) => getTextFromNode(opt.label)).join(", ")}</span>;
    }

    const selected = options.find((opt) => opt.value === selectedValue);
    if (!selected) return <span className={mergeClass("select-display-text", "placeholder")}>{placeholder}</span>;
    return <span className='select-display-text'>{selected.label}</span>;
  }

  const hasValue = multiple ? selectedValues.length > 0 : selectedValue !== "";

  const enabledFilteredOptions = filteredOptions.filter((opt) => !opt.disabled);

  function handleSelectAll() {
    if (!multiple) return;
    const current = isControlled ? ((props as SelectMultipleProps<Value>).value ?? []) : multipleValues;
    const allEnabledValues = enabledFilteredOptions.map((opt) => opt.value);
    const allSelected = allEnabledValues.every((v) => current.includes(v));

    if (allSelected) {
      const next = current.filter((v) => !allEnabledValues.includes(v));
      if (!isControlled) setMultipleValues(next);
      (props as SelectMultipleProps<Value>).onChange?.(next);
    } else {
      const next = [...new Set([...current, ...allEnabledValues])];
      if (!isControlled) setMultipleValues(next);
      (props as SelectMultipleProps<Value>).onChange?.(next);
    }
    requestAnimationFrame(triggerNativeValidation);
  }

  const allFilteredSelected = multiple && enabledFilteredOptions.length > 0 && enabledFilteredOptions.every((opt) => selectedValues.includes(opt.value));

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled && !loading) {
          setOpen(true);
          setFocusedIndex(0);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < enabledFilteredOptions.length - 1 ? prev + 1 : 0));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : enabledFilteredOptions.length - 1));
        break;
      }
      case "Enter":
      case " ": {
        if (searchable && e.key === " ") break;
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < enabledFilteredOptions.length) {
          handleOptionClick(enabledFilteredOptions[focusedIndex]);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        close();
        break;
      }
      case "Tab": {
        close();
        break;
      }
    }
  }

  const nativeSelectValue = multiple ? selectedValues : selectedValue;

  return (
    <label
      ref={containerRef}
      htmlFor={id}
      css={cssProp}
      className={mergeClass("container-input", className, {
        "select-open": open,
        "select-disabled": disabled,
        "select-loading": loading,
      })}
      data-component='Select'
      data-css='Select'
      onKeyDown={handleKeyDown}
    >
      <span className='label-text'>
        {label} {multiple && <span className='select-multiple-tag'>{dictionary.multiple}</span>}
      </span>

      <select
        ref={selectRef}
        className='select-hidden input-element'
        id={id}
        name={name}
        multiple={multiple}
        required={required}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-required={required}
        tabIndex={-1}
        value={nativeSelectValue}
        onChange={() => {}}
        onInvalid={(e) => setInvalid(e, validate)}
        css={inputCss}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {getTextFromNode(option.label)}
          </option>
        ))}
      </select>

      <div
        className={mergeClass("select-display", inputClassName)}
        onClick={handleToggle}
        tabIndex={disabled || loading ? -1 : 0}
        role='combobox'
        aria-expanded={open}
        aria-haspopup='listbox'
        {...displayEventHandlers}
      >
        {getDisplayContent()}
        {loading && <LoadingSpinner size='xs' />}
        {clearable && hasValue && !disabled && !loading && <Icon icon='close' size='xs' onClick={handleClear} />}
        {!loading && !disabled && <Icon icon={open ? "expandLess" : "expandMore"} size='sm' className='select-chevron' />}
      </div>

      {validationMessage && (
        <Tooltip content={<span className='error-text'>{validationMessage}</span>} position='left'>
          <Icon icon='warning' size='sm' className='error-icon' />
        </Tooltip>
      )}

      <div ref={optionsContainerRef} className={mergeClass("select-options-container", { "open-above": position.openAbove })} css={containerOptionsCss} role='listbox' aria-multiselectable={multiple}>
        {searchable && (
          <div className='select-search-row'>
            {multiple && <Checkbox id={`${id}-select-all`} label={dictionary.selectAll} checked={allFilteredSelected || false} onChange={handleSelectAll} />}
            <Input id={`${id}-search`} name={`${id}-search`} placeholder={dictionary.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        )}

        <div className='select-options-list'>
          {filteredOptions.length === 0 && <div className='select-no-options'>{dictionary.noOptions}</div>}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={mergeClass("select-option", {
                selected: isOptionSelected(option.value),
                disabled: !!option.disabled,
                focused: enabledFilteredOptions[focusedIndex]?.value === option.value,
              })}
              role='option'
              aria-selected={isOptionSelected(option.value)}
              aria-disabled={option.disabled}
              onClick={() => handleOptionClick(option)}
            >
              {multiple && <span className='select-option-check'>{isOptionSelected(option.value) && <Icon icon='done' size='sm' />}</span>}
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </label>
  );
}
