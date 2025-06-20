import NavBar from "./NavBar";
import Home from "./Home";

function App() {
  const Title = "BUET INSTITUTIONAL INFORMATION SYSTEM";
  const BIIS = "https://biis.buet.ac.bd/";
  return (
    <div className="App">
      <NavBar />
      <Home />
      <h1>{Title}</h1>
      <p>
        Mahrez Hussain Khan <br /> Apurbo Das Pranto
      </p>
      <p>{Math.random()}</p>
      <a href={BIIS}>BIIS</a>
    </div>
  );
}

export default App;
