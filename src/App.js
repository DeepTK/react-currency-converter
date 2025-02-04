import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import switch_img from "./switch.png";

function App() {
  const [amount, setAmount] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
      })
      .catch((error) => console.error("Error fetching currency data:", error));
  }, []);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then((response) => response.json())
        .then((data) => {
          const conversionRate = data.rates[toCurrency];
          setConvertedAmount((amount * conversionRate).toFixed(2));
        })
        .catch((error) =>
          console.error("Error fetching exchange rate:", error)
        );
    }
  }, [amount, fromCurrency, toCurrency]);

  const switchHandler = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="App container my-5">
      <Card style={{ background: "#F8F9F9" }}>
        <CardBody>
          <CardTitle
            tag="h5"
            className="text-center"
            style={{ fontStyle: "italic", fontSize: "3rem" }}
          >
            <b>Currency Converter</b>
          </CardTitle>
          <div>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    value={amount}
                    type="number"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="from">From</Label>
                  <Input
                    type="select"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2" className="text-center">
                <img
                  src={switch_img}
                  onClick={switchHandler}
                  style={{ maxWidth: "50px", cursor: "pointer" }}
                  alt="Switch"
                />
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="to">To</Label>
                  <Input
                    type="select"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </div>
          <CardFooter>
            <h5>Converted Amount</h5>
            <p>
              {convertedAmount} {toCurrency}
            </p>
          </CardFooter>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;
