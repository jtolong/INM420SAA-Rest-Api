// UD variable declaration
const input = document.getElementById("termInput");
const resultDiv = document.getElementById("result");
const historyTermsDiv = document.getElementById("historyTerms");

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fetchDefinition();
  }
});
// search UD
function saveSearch(term) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(term)) {
    history.unshift(term);
    if (history.length > 10) history.pop();
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  renderSearchHistory();
}
// search history 
function renderSearchHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  historyTermsDiv.innerHTML = "";
  history.forEach(term => {
    const tag = document.createElement("span");
    tag.className = "history-term";
    tag.textContent = term;
    tag.onclick = () => {
      input.value = term;
      fetchDefinition();
    };
    historyTermsDiv.appendChild(tag);
  });
}
// get definition 
async function fetchDefinition() {
  const term = input.value.trim();
  if (!term) {
    resultDiv.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  resultDiv.innerHTML = '<div class="spinner"></div>';

  const url = `https://urban-dictionary7.p.rapidapi.com/v0/define?term=${term}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '06798e4eddmsh5d1d30817126b48p134c15jsnb8e1a2b352bd',
      'x-rapidapi-host': 'urban-dictionary7.p.rapidapi.com'
    }
  };
  // cannot get definition
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.list || data.list.length === 0) {
      resultDiv.innerHTML = `<p>No definition found for "${term}".</p>`;
      return;
    }
    // save search
    saveSearch(term);

    const defs = data.list.slice(0, 3);
    let output = `<h3>Definitions for "${term}":</h3>`;

    defs.forEach((item, index) => {
      const def = item.definition;
      const example = item.example || "No example provided.";
      const thumbsUp = item.thumbs_up || 0;
      const thumbsDown = item.thumbs_down || 0;
      // card definition
      output += `
        <div class="card">
          <div class="card-header" onclick="toggleCard(this)">
            Definition ${index + 1}
          </div>
          <div class="card-content" style="display: ${index === 0 ? 'block' : 'none'};">
            ${def}
            <div class="meta">
              <em>Example:</em> ${example}<br>
              👍 ${thumbsUp} | 👎 ${thumbsDown}
            </div>
          </div>
        </div>`;
    });

    resultDiv.innerHTML = output;
  } catch (error) {
    resultDiv.innerHTML = "<p>Something went wrong. Try again later.</p>";
    console.error(error);
  }
}
// clear results
function clearResults() {
  input.value = "";
  resultDiv.innerHTML = "";
  input.focus();
}
// open and close card
function toggleCard(header) {
  const content = header.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
    content.style.animation = "slideDown 0.3s ease";
  }
}

renderSearchHistory();
