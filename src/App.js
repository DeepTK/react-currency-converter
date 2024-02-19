import { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
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
  const [fromCurrencyData, setFromCurrencyData] = useState([]);
  const [toCurrencyData, setToCurrencyData] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const fetchRates = async () => {
    fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        setFromCurrencyData(
          Object.entries(data).map(
            ([key, value]) =>
              value !== "" && (
                <option
                  key={key}
                  value={key.toUpperCase()}
                  selected={fromCurrency == key.toUpperCase()}
                >
                  {value + " ( " + key.toUpperCase() + " )"}
                </option>
              )
          )
        );
        setToCurrencyData(
          Object.entries(data).map(
            ([key, value]) =>
              value !== "" && (
                <option
                  key={key}
                  value={key.toUpperCase()}
                  selected={toCurrency == key.toUpperCase()}
                >
                  {value + " ( " + key.toUpperCase() + " )"}
                </option>
              )
          )
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleConvert = async () => {
    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency.toLowerCase()}.json`;
    console.log(url);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data[fromCurrency.toLowerCase()]);
        const conversionRate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
        if (fromCurrency.length === 1 || fromCurrency.charAt(0) === "0") {
          setConvertedAmount(conversionRate);
        } else {
          const converted = amount * conversionRate;
          setConvertedAmount(converted.toFixed(2));
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleAmountChange = (value) => {
    // Ensure value contains only digits and at most one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      // Check if the value contains more than one decimal point
      if ((value.match(/\./g) || []).length <= 1) {
        setAmount(value);
      }
    }
  };

  const switchHandler = () => {
    let from = fromCurrency;
    let to = toCurrency;
    // console.log(from, to);
    setFromCurrency(to);
    setToCurrency(from);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fromCurrency, toCurrency]);

  console.log(convertedAmount)
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
          <CardText>
            <Row>
              <Col md="4" sm="4" xl="5" xxl="5">
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    value={amount}
                    placeholder="with a placeholder"
                    type="text"
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="3" sm="4" xl="3" xxl="3">
                <FormGroup>
                  <Label for="from">From</Label>
                  <Input
                    type="select"
                    defaultValue={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {fromCurrencyData}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2" sm="4" xl="1" xxl="1" className="text-center">
                <img
                  src={switch_img}
                  onClick={switchHandler}
                  style={{ maxWidth: "100px" }}
                />
              </Col>
              <Col md="3" sm="4" xl="3" xxl="3">
                <FormGroup>
                  <Label for="from">From</Label>
                  <Input
                    type="select"
                    defaultValue={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {toCurrencyData}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button color="success" onClick={handleConvert}>
              Convert
            </Button>
          </CardText>
          <CardFooter>
            <h5>Converted Amount</h5>
            <p>{convertedAmount}</p>
          </CardFooter>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;
