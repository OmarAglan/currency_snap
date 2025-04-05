import { useCallback, useEffect, useState } from "react";
import ConverterSelect from "./ConverterSelect";

function ConverterForm() {
  const [amount, setAmount] = useState(5);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EGP");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for supported currency codes
  const [supportedCodes, setSupportedCodes] = useState([]);
  const [codesLoading, setCodesLoading] = useState(true);
  const [codesError, setCodesError] = useState(null);

  // Fetch supported codes on mount
  useEffect(() => {
    const fetchSupportedCodes = async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;
      // Use the standard endpoint to get all rates relative to USD, just to extract codes
      const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
      setCodesLoading(true);
      setCodesError(null);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch supported currencies (Status: ${response.status})`);
        }
        const data = await response.json();
        if (data.result === 'error') {
          throw new Error(`API Error while fetching codes: ${data['error-type']}`);
        }
        if (data.conversion_rates) {
          setSupportedCodes(Object.keys(data.conversion_rates));
        } else {
          throw new Error("Invalid data format for supported currencies.");
        }
      } catch (err) {
        console.error("Error fetching supported codes:", err);
        setCodesError(err.message || "Could not load currency list.");
        setSupportedCodes([]); // Ensure codes list is empty on error
      } finally {
        setCodesLoading(false);
      }
    };

    fetchSupportedCodes();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }
  const fetchCurrencyRate = useCallback(async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

    // Parse amount, default to 0 if invalid or empty
    const numericAmount = parseFloat(amount) || 0;
    // Prevent API call if amount is negative (although min="0" helps)
    if (numericAmount < 0) {
        setError("Amount cannot be negative.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    // Don't fetch if amount is 0, just clear results/errors
    if (numericAmount === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch the currency rate (Status: ${response.status})`);
      }
      else if (response.ok) {
        const data = await response.json();
        if (data.result === 'error') {
            throw new Error(`API Error: ${data['error-type']}`);
        }
        // Use numericAmount for calculation
        const rate = (data.conversion_rate * numericAmount).toFixed(2);
        // Use numericAmount for display consistency
        setResult(`${numericAmount} ${fromCurrency} = ${rate} ${toCurrency}`);
        console.log("Currency rate: ", rate);
      } else {
        console.error("Error fetching the currency rate: ", response.statusText);
        setError(`An unexpected error occurred (Status: ${response.statusText})`);
      }
    } catch (error) {
      console.error("Error fetching the currency rate: ", error);
      setError(error.message || "An unknown error occurred while fetching the rate.");
    } finally {
      setIsLoading(false);
    }
    // Depend on numericAmount derived from state, not raw amount state
  }, [fromCurrency, toCurrency, amount]); // Keep amount in dependency array as parsing depends on it


  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchCurrencyRate();
    console.log("Form Submitted");
  }

  // Re-fetch rate whenever currencies or amount change (if codes loaded)
  useEffect(() => {
    if (!codesLoading && !codesError) { // Only fetch rate if codes are loaded successfully
        fetchCurrencyRate();
    }
    // Add codesLoading/codesError as dependencies to trigger fetch after codes load
  }, [fetchCurrencyRate, codesLoading, codesError]);


  return (
    <form className="currency-snap__form" onSubmit={handleFormSubmit}>
      {/* Disable fieldset while codes are loading or if there was an error loading them */}
      <fieldset disabled={isLoading || codesLoading || !!codesError} className="currency-snap__fieldset">
        {/* Enter The Amount */}
        <div className="currency-snap__form__group">
          <label className="currency-snap__form__label">
            Enter The Amount
          </label>
          <input
            className="currency-snap__form__input"
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required={true}
            title="Enter The Amount"
            placeholder="Enter amount"
          />
        </div>
        {/* Select The Currency */}
        <div className="currency-snap__form__group currency-snap__form__group--two">
          <div className="currency-snap__form__section">
            <label className="currency-snap__form__label">
              From
            </label>
            <ConverterSelect
              selectedCurrency={fromCurrency}
              handleCurrencyChange={e => setFromCurrency(e.target.value)}
              currencyList={supportedCodes} // Pass supported codes
            />
          </div>

          {/* Exchange Icon */}
          <div className="currency-snap__swap__icon" onClick={!isLoading ? handleSwapCurrency : undefined} >
            <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                fill="#fff"
              />
            </svg>
          </div>

          {/* To The Currency */}
          <div className="currency-snap__form__section">
            <label className="currency-snap__form__label">
              To
            </label>
            <ConverterSelect
              selectedCurrency={toCurrency}
              handleCurrencyChange={e => setToCurrency(e.target.value)}
              currencyList={supportedCodes} // Pass supported codes
            />
          </div>
        </div>
        <button type="submit" className="currency-snap__form__button">
          Update Exchange Rate
        </button>
      </fieldset>

      {/* Display loading/error state for codes */}
      {codesLoading && <p className="currency-snap__loading-codes">Loading currency list...</p>}
      {codesError && <p className="currency-snap__error">Error loading currencies: {codesError}</p>}

      {/* Display rate result/loading/error */}
      {!codesError && !codesLoading && (
          <p className={`${isLoading ? "Loading" : ""} currency-snap__rate`}>
            {isLoading ? "Getting Exchange Rate..." : result}
          </p>
      )}
      {error && <p className="currency-snap__error">Error: {error}</p>}
    </form>
  );
}

export default ConverterForm;
