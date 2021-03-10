import { useState } from 'react';
import useAsyncFn from "../use-async-func";

const getPokemonById = async (id) => {
  await setTimeout(() => { console.log('I waited 1000ms') }, 1000);
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json());
  return pokemon;
}

const App = () => {
  const [id, setId] = useState("1");
  const [{ isLoading, isError, data: pokemon }, setArgs] = useAsyncFn(getPokemonById, [id]);

  const handleChange = (event) => {
    event.preventDefault();
    setId(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Don't forget to put args in an array
    setArgs([id])
  }

  return (
    <div>
      <h3>Enter Pokemon Id</h3>
      <input type="text" value={id} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
      {pokemon && (
        <div>
          <p>Pokemon:</p>
          <code style={{ fontSize: "20px" }}>{pokemon.name}</code>
        </div>
      )}
      {isLoading && <p style={{ color: "blue", fontSize: "20px" }}>LOADING</p>}
      {isError && <p style={{ color: "red", fontSize: "20px" }}>ERROR</p>}
      <p>* try valid and invalid ids</p>
    </div>
  );
}
