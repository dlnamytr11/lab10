import NewsFeed from "./components/NewsFeed";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <h1 className="headline">Новостная лента</h1>
      <NewsFeed />
    </div>
  );
}
