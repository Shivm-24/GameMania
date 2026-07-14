import { useState } from "react";
import BasicExample from "./Components/NavBar";
import Features from "./Components/Features";
import HomePage from "./Components/Home";
import GameArena from "./Components/GameArena"; // 1. Just imported the brand new page

function App() {
  const [page, setPage] = useState("home");
  const [selectedGameId, setSelectedGameId] = useState("");

  const handleGameLaunch = (gameId) => {
    setSelectedGameId(gameId); // Saves target click details
    setPage("arena");          // Routing triggers here safely
  };

  return (
    <>
      <BasicExample setPage={setPage} />

      {/* Home portal handles layout identically */}
      {page === "home" && <HomePage onSelectGame={handleGameLaunch} />}
      {page === "features" && <Features />}
      
      {/* 🕹️ The newly created standalone page workspace layout */}
      {page === "arena" && (
        <GameArena 
          gameId={selectedGameId} 
          onBack={() => setPage("home")} 
        />
      )}
    </>
  );
}

export default App;
