import { useCallback, useEffect, useState } from "react";
import ConverterSelect from "./ConverterSelect";

function ConverterForm() {
  const [amount, setAmount] = useState(5);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EGP");
  const [result, setResult] = useState("");

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }
  const fetchCurrencyRate = useCallback(async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
    // Your code to fetch the currency rate goes here
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch the currency rate");
      }
      else if (response.ok) {
        const data = await response.json();
        const rate = (data.conversion_rate * amount).toFixed(2);
        setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
        console.log("Currency rate: ", rate);
      } else {
        console.error("Error fetching the currency rate: ", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching the currency rate: ", error);
    }
  }, [fromCurrency, toCurrency, amount]);


  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchCurrencyRate();
    console.log("Form Submitted");
  }

  useEffect(() => {
    fetchCurrencyRate();
  }, [fetchCurrencyRate]);


  return (
    <form className="currency-snap__form" onSubmit={handleFormSubmit}>
      {/* Enter The Amount */}
      <div className="currency-snap__form__group">
        <label className="currency-snap__form__label">
          Enter The Amount
        </label>
        <input
          className="currency-snap__form__input"
          type="float"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required={true}
          title="Enter The Amount"
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
          />
        </div>

        {/* Exchange Icon */}
        <div className="currency-snap__swap__icon" onClick={handleSwapCurrency}>
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
          />
        </div>
      </div>
      <button type="submit" className="currency-snap__form__button">
        Update Exchange Rate
      </button>

      <p className="currency-snap__rate">
        {result}
      </p>
    </form>
  );
}

export default ConverterForm;
