import React, { useState } from "react";

const FlashcardForm = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");

  const handleSubmit = async (e) => {
    // e.preventDefault();

    const flashcardData = [{ word, definition }];
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flashcardData),
    };

    try {
      const response = await fetch(
        "https://flashcard-l2ai.onrender.com/insertWords",
        requestOptions
      );

      if (response.ok) {
        alert("Word and definition added successfully!");
        setWord(""); // Clear the 'word' state
        setDefinition(""); // Clear the 'definition' state
        window.location.reload();
      } else {
        alert("Failed to add word and definition.");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("An error occurred while adding the word.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="word">Word:</label>
          <input
            type="text"
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="definition">Definition:</label>
          <textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
        </div>
        <button type="submit">Add Flashcard</button>
      </form>
    </div>
  );
};

export default FlashcardForm;
