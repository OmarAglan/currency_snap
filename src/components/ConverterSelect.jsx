import PropTypes from 'prop-types';
import Select from 'react-select'; // Import react-select

// Mapping from Currency Code to ISO 3166-1 alpha-2 Country Code
const currencyToCountryMap = {
  USD: "US", // United States Dollar
  EUR: "EU", // Euro (Using EU for FlagsAPI, represents European Union)
  JPY: "JP", // Japanese Yen
  GBP: "GB", // British Pound
  AUD: "AU", // Australian Dollar
  CAD: "CA", // Canadian Dollar
  CHF: "CH", // Swiss Franc
  CNY: "CN", // Chinese Yuan
  SEK: "SE", // Swedish Krona
  NZD: "NZ", // New Zealand Dollar
  MXN: "MX", // Mexican Peso
  SGD: "SG", // Singapore Dollar
  HKD: "HK", // Hong Kong Dollar
  NOK: "NO", // Norwegian Krone
  KRW: "KR", // South Korean Won
  TRY: "TR", // Turkish Lira
  RUB: "RU", // Russian Ruble
  INR: "IN", // Indian Rupee
  BRL: "BR", // Brazilian Real
  ZAR: "ZA", // South African Rand
  EGP: "EG", // Egyptian Pound
  AED: "AE", // UAE Dirham
  SAR: "SA", // Saudi Riyal
  // Add more mappings as needed
};

// Function to get flag URL (reusable)
const getFlagUrl = (currencyCode) => {
    const countryCode = currencyToCountryMap[currencyCode];
    return countryCode ? `https://flagsapi.com/${countryCode}/flat/24.png` : null; // Smaller flag
};

// Custom format function for options and selected value
const formatOptionLabel = ({ value, label }) => {
    const flagUrl = getFlagUrl(value);
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {flagUrl && <img src={flagUrl} alt={`${label} flag`} style={{ marginRight: '10px', width: '24px', height: '16px' }} />}
            <span>{label}</span>
        </div>
    );
};

// --- Custom Styles for React-Select (DARK THEME) ---
const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '52px', // Match input height
        height: '52px',
        borderRadius: '8px',
        border: state.isFocused ? '1px solid #20c997' : '1px solid #50555a', // Dark border, teal focus
        boxShadow: state.isFocused ? '0 0 0 3px rgba(32, 201, 151, 0.25)' : 'none', // Teal focus ring
        backgroundColor: state.isFocused ? '#40454a' : '#3a3f44', // Dark background, slightly lighter on focus
        '&:hover': {
            borderColor: state.isFocused ? '#20c997' : '#6c757d', // Lighter hover border
        },
        cursor: 'pointer',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
    }),
    valueContainer: (provided) => ({
        ...provided,
        height: '52px',
        padding: '0 8px'
    }),
    input: (provided) => ({
        ...provided,
        margin: '0px',
        padding: '0px',
        height: 'auto',
        color: '#e0e0e0', // Light text color for input
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '52px',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: '8px',
        color: '#a0a5ac', // Lighter gray indicator
        '&:hover': {
            color: '#e0e0e0',
        }
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '8px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)', // Dark shadow
        border: '1px solid #50555a', // Dark border
        backgroundColor: '#3a3f44', // Dark menu background
        marginTop: '4px',
        zIndex: 2, // Ensure menu is above other elements if needed
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#20c997' : state.isFocused ? '#4a4f54' : '#3a3f44',
        color: state.isSelected ? '#111' : '#e0e0e0',
        cursor: 'pointer',
        '&:active': { // Keep active state subtle
            backgroundColor: !state.isDisabled ? (state.isSelected ? provided.backgroundColor : '#4a4f54') : undefined,
        },
        padding: '12px 15px', // Adjust padding
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#e0e0e0', // Light text for selected value
        display: 'flex',
        alignItems: 'center',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#a0a5ac', // Placeholder text color
    }),
};
// --- End Custom Styles ---

const ConverterSelect = ({ selectedCurrency, handleCurrencyChange, currencyList }) => {

    // Map currencyList strings to { value, label } format for react-select
    const options = currencyList.map(code => ({ value: code, label: code }));

    // Find the currently selected option object
    const selectedOption = options.find(option => option.value === selectedCurrency);

    // Handle change from react-select (passes the whole option object)
    const handleChange = (selectedOptionObject) => {
        if (selectedOptionObject) {
            handleCurrencyChange(selectedOptionObject.value); // Extract the value
        }
    };

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={handleChange}
            formatOptionLabel={formatOptionLabel} // Use custom renderer
            styles={customSelectStyles} // Apply custom styles
            isSearchable={true} // Allow searching the list
            placeholder="Select..."
            inputId={`currency-select-${Math.random()}`} // Basic unique ID for label association if needed
            aria-label="Select currency" // Accessibility
        />
    );
};

// Define prop types
ConverterSelect.propTypes = {
  selectedCurrency: PropTypes.string.isRequired,
  handleCurrencyChange: PropTypes.func.isRequired,
  currencyList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ConverterSelect;