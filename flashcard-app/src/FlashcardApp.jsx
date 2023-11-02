import React, { useState, useEffect } from "react";
import "./FlashcardApp.css";

function FlashcardApp() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showingDefinition, setShowingDefinition] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [shuffledFlashcardOrder, setShuffledFlashcardOrder] = useState([]);

  useEffect(() => {
    // Fetch flashcards data when the component mounts
    fetch("https://flashcard-l2ai.onrender.com/fetchData")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFlashcards(data);
        setShuffledFlashcardOrder(shuffleArray(data)); // Shuffle the initial order
        console.log("Data fetched and stored in flashcards array:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const toggleDefinition = () => {
    setShowingDefinition(!showingDefinition);
  };

  const displayFlashcard = () => {
    return showingDefinition
      ? shuffledFlashcardOrder[currentFlashcardIndex]?.definition
      : shuffledFlashcardOrder[currentFlashcardIndex]?.word;
  };

  const handlePrevious = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
      setShowingDefinition(false); // Reset to show word when switching to a new flashcard
    }
  };

  const handleNext = () => {
    if (currentFlashcardIndex < shuffledFlashcardOrder.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setShowingDefinition(false); // Reset to show word when switching to a new flashcard
    }
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const foundWord = shuffledFlashcardOrder.find((item) =>
      item.word.toLowerCase().includes(searchTermLower)
    );
    if (foundWord) {
      setSearchResult("Definition: " + foundWord.definition);
    } else {
      setSearchResult("No matching words found.");
    }
  };

  const toggleTableOfContents = () => {
    setShowTableOfContents(!showTableOfContents);
  };

  return (
    <div>
      <div className="burger" onClick={toggleTableOfContents}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>

      <div className={`table-of-contents ${showTableOfContents ? "open" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            {flashcards.map((item, index) => (
              <tr key={index}>
                <td>{item.word}</td>
                <td>{item.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="close-button"
          style={{ display: showTableOfContents ? "" : "none" }}
          onClick={toggleTableOfContents}
        >
          &times;
        </div>
      </div>

      <div className="flashcard-container">
        <div className="flashcard" onClick={toggleDefinition}>
          <p id="title-flash">{showingDefinition ? "Definition" : "Word"}</p>
          <p id="flashcard-text" onClick={toggleDefinition}>
            {displayFlashcard()}
          </p>
        </div>
      </div>
      <div className="button-container">
        <button className="button" onClick={handlePrevious}>
          Previous
        </button>
        <button className="button" onClick={handleNext}>
          Next
        </button>
      </div>
      <input
        className="search"
        placeholder="Search for a word"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button id="searchButton" onClick={handleSearch}>
        Search
      </button>
      <div id="result">{searchResult}</div>
    </div>
  );
}

export default FlashcardApp;
