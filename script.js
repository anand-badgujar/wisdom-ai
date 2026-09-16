const API_URL = "https://vedicscriptures.github.io";


// ========================================
// GLOBAL DATA
// ========================================

let chapters = [];


// ========================================
// LOAD ALL CHAPTERS
// ========================================

async function loadChapters() {

    try {

        const response =
            await fetch(`${API_URL}/chapters`);

        if (!response.ok) {
            throw new Error("Failed to load chapters");
        }

        const data =
            await response.json();

        chapters = data;

        console.log("Chapters:", chapters);

        displayChapters();

    } catch (error) {

        console.error(
            "Error loading chapters:",
            error
        );

        document.getElementById("chapters").innerHTML = `
            <div class="result-card">
                <p>
                    Unable to load Bhagavad Gita chapters.
                    Please try again later.
                </p>
            </div>
        `;
    }
}


// ========================================
// DISPLAY ALL CHAPTERS
// ========================================

function displayChapters() {

    const container =
        document.getElementById("chapters");

    container.innerHTML = "";


    chapters.forEach(chapter => {

        container.innerHTML += `

            <div class="chapter-card">

                <h3>
                    Chapter ${chapter.chapter_number}
                </h3>

                <h2>
                    ${chapter.name}
                </h2>

                <p>
                    ${chapter.summary?.en || ""}
                </p>

                <p>
                    <strong>Verses:</strong>
                    ${chapter.verses_count}
                </p>

                <button
                    onclick="loadChapter(${chapter.chapter_number})"
                >
                    Read Chapter
                </button>

            </div>

        `;

    });
}


// ========================================
// LOAD ONE CHAPTER
// ========================================

async function loadChapter(chapterNumber) {

    try {

        const response =
            await fetch(
                `${API_URL}/chapter/${chapterNumber}`
            );

        if (!response.ok) {
            throw new Error("Failed to load chapter");
        }

        const chapter =
            await response.json();

        console.log(
            "Selected Chapter:",
            chapter
        );


        displayChapter(chapter);


    } catch (error) {

        console.error(
            "Error loading chapter:",
            error
        );

    }

}


// ========================================
// DISPLAY ONE CHAPTER
// ========================================

function displayChapter(chapter) {

    const container =
        document.getElementById("verseSection");


    /*
       Different API versions/records can expose
       verse data differently.

       So first inspect the object in the console.
    */

    console.log("Chapter object:", chapter);


    container.innerHTML = `

        <div class="result-card">

            <h2>
                Chapter ${chapter.chapter_number || ""}
            </h2>

            <h1>
                ${chapter.name || ""}
            </h1>

            <p>
                ${chapter.summary?.en || ""}
            </p>

            <hr>

            <p>
                Chapter loaded successfully.
            </p>

            <p>
                Open the browser console to inspect
                the chapter data.
            </p>

        </div>

    `;

    // Scroll to the chapter
    container.scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// LOAD ONE VERSE
// ========================================

async function loadVerse(
    chapterNumber,
    verseNumber
) {

    try {

        const response =
            await fetch(
                `${API_URL}/slok/${chapterNumber}/${verseNumber}`
            );

        if (!response.ok) {
            throw new Error("Failed to load verse");
        }

        const verse =
            await response.json();


        console.log(
            "Verse:",
            verse
        );


        displayVerse(
            verse,
            chapterNumber,
            verseNumber
        );


    } catch (error) {

        console.error(
            "Error loading verse:",
            error
        );

    }

}


// ========================================
// DISPLAY VERSE
// ========================================

function displayVerse(
    verse,
    chapterNumber,
    verseNumber
) {

    const container =
        document.getElementById(
            "verseSection"
        );


    container.innerHTML = `

        <div class="result-card">

            <h2>
                Bhagavad Gita
                ${chapterNumber}:${verseNumber}
            </h2>


            <h3>
                Sanskrit
            </h3>

            <p>
                ${verse.slok || ""}
            </p>


            <h3>
                Meaning
            </h3>

            <p>
                ${
                    verse.tej?.ht ||
                    "Meaning unavailable"
                }
            </p>

        </div>

    `;


    container.scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// AI SPIRITUAL GUIDANCE
// ========================================

const BACKEND_URL = "http://localhost:3000";

document
    .getElementById("searchForm")
    .addEventListener(
        "submit",
        getSpiritualGuidance
    );


async function getSpiritualGuidance(event) {

    event.preventDefault();

    const searchInput =
        document.getElementById("searchInput");

    const result =
        document.getElementById("result");

    const verseSection =
        document.getElementById("verseSection");

    const problem =
        searchInput.value.trim();


    // --------------------------------
    // Validate
    // --------------------------------

    if (!problem) {

        result.innerHTML = `
            <div class="result-card">

                <p>
                    Please describe your situation.
                </p>

            </div>
        `;

        return;
    }


    // --------------------------------
    // Loading state
    // --------------------------------

    result.innerHTML = `
        <div class="result-card">

            <h2>Reflecting on your situation...</h2>

            <p>
                Finding relevant wisdom from
                the Bhagavad Gita.
            </p>

        </div>
    `;

    verseSection.innerHTML = "";


    try {

        // --------------------------------
        // Call backend
        // --------------------------------

        const response =
            await fetch(
                `${BACKEND_URL}/api/guidance`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        problem: problem
                    })

                }
            );


        const data =
            await response.json();


        // --------------------------------
        // Handle error
        // --------------------------------

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to generate guidance."
            );

        }


        // --------------------------------
        // Display guidance
        // --------------------------------

        displayGuidance(data);


    } catch (error) {

        console.error(
            "Guidance error:",
            error
        );


        result.innerHTML = `
            <div class="result-card">

                <h2>Unable to generate guidance</h2>

                <p>
                    Something went wrong while
                    connecting to the spiritual
                    guidance service.
                </p>

                <p>
                    Please make sure the backend
                    server is running.
                </p>

            </div>
        `;

    }

}


// ========================================
// DISPLAY GUIDANCE
// ========================================

function displayGuidance(data) {

    const result =
        document.getElementById("result");

    const verseSection =
        document.getElementById("verseSection");


    // --------------------------------
    // Guidance
    // --------------------------------

    result.innerHTML = `

        <div class="result-card">

            <h2>
                Spiritual Guidance
            </h2>

            <div class="guidance-text">
                ${formatGuidance(data.guidance)}
            </div>

        </div>

    `;


    // --------------------------------
    // Relevant verses
    // --------------------------------

    if (
        data.verses &&
        data.verses.length > 0
    ) {

        verseSection.innerHTML = `

            <div class="result-card">

                <h2>
                    Relevant Gita Teachings
                </h2>

                <div id="retrievedVerses"></div>

            </div>

        `;


        const container =
            document.getElementById(
                "retrievedVerses"
            );


        data.verses.forEach(verse => {

            container.innerHTML += `

                <div class="verse-result">

                    <h3>
                        Bhagavad Gita
                        ${verse.chapter}:${verse.verse}
                    </h3>

                    <p>
                        <strong>Topic:</strong>
                        ${verse.topic || "Gita Teaching"}
                    </p>

                    <p>
                        <strong>Relevance:</strong>
                        ${(
                            verse.similarity * 100
                        ).toFixed(1)}%
                    </p>

                </div>

            `;

        });

    }

}


// ========================================
// FORMAT GEMINI RESPONSE
// ========================================

function formatGuidance(text) {

    if (!text) {
        return "";
    }


    return text
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(
            /\n\n/g,
            "<br><br>"
        )
        .replace(
            /\n/g,
            "<br>"
        );

}


// ========================================
// CURRENT SEARCH
// ========================================

function searchGita(event) {

    event.preventDefault();


    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const result =
        document.getElementById("result");


    if (!searchText) {

        result.innerHTML = `

            <div class="result-card">

                <p>
                    Please describe your situation.
                </p>

            </div>

        `;

        return;
    }


    const matches =
        chapters.filter(chapter => {

            const text =
                JSON.stringify(chapter)
                    .toLowerCase();

            return text.includes(
                searchText
            );

        });


    if (matches.length === 0) {

        result.innerHTML = `

            <div class="result-card">

                <h2>
                    No direct match found
                </h2>

                <p>
                    We could not find a chapter
                    containing those exact words.
                </p>

                <p>
                    Semantic/spiritual search will
                    be added in a later phase.
                </p>

            </div>

        `;

        return;
    }


    result.innerHTML = `

        <h2>
            Relevant Chapters
        </h2>

    `;


    matches.forEach(chapter => {

        result.innerHTML += `

            <div class="result-card">

                <h3>
                    Chapter ${chapter.chapter_number}
                </h3>

                <h2>
                    ${chapter.name}
                </h2>

                <p>
                    ${chapter.summary?.en || ""}
                </p>

                <p>
                    <strong>
                        Verses:
                    </strong>

                    ${chapter.verses_count}
                </p>

                <button
                    onclick="loadChapter(
                        ${chapter.chapter_number}
                    )"
                >
                    Read Chapter
                </button>

            </div>

        `;

    });

}


// ========================================
// START APPLICATION
// ========================================

loadChapters();





const concepts = {

    failure: [
        "failure",
        "failed",
        "fail",
        "unsuccessful",
        "lost",
        "loss"
    ],

    fear: [
        "fear",
        "afraid",
        "scared",
        "worry",
        "worried",
        "anxious"
    ],

    anger: [
        "anger",
        "angry",
        "furious",
        "rage",
        "mad"
    ],

    confusion: [
        "confused",
        "confusion",
        "lost",
        "uncertain",
        "unclear"
    ],

    work: [
        "work",
        "working",
        "job",
        "career",
        "effort"
    ],

    results: [
        "result",
        "results",
        "outcome",
        "reward"
    ],

    relationships: [
        "friend",
        "relationship",
        "family",
        "betrayed",
        "betrayal"
    ],

    attachment: [
        "attached",
        "attachment",
        "letting go",
        "obsessed"
    ],

    anger: [
        "anger",
        "angry",
        "furious",
        "rage"
    ],

    peace: [
        "peace",
        "calm",
        "stress",
        "restless"
    ]

};





const teachings = [

    {
        book: "Bhagavad Gita",
        chapter: 2,
        verse: 47,

        topics: [
            "work",
            "results",
            "effort",
            "attachment",
            "failure"
        ],

        keywords: [
            "karma",
            "action",
            "result",
            "effort",
            "work"
        ],

        explanation:
            "Focus on performing your actions sincerely rather than becoming completely attached to the outcome."
    },


    {
        book: "Bhagavad Gita",
        chapter: 6,
        verse: 5,

        topics: [
            "self-control",
            "mind",
            "self-improvement",
            "discipline"
        ],

        keywords: [
            "mind",
            "self",
            "control",
            "discipline"
        ],

        explanation:
            "The teaching emphasizes the importance of mastering and uplifting one's own mind."
    }

];
