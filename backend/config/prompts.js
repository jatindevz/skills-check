const getquizPrompt = (userinput) => {

    const prompt = `A student is learning a skill but struggles with self-doubt. He isn’t sure whether what he has learned is enough and lacks confidence in his current knowledge. The skill he is learning is or his statement on that skill: ${userinput}.

    Generate 20 quiz questions that accurately assess his understanding of this skill and reveal gaps in his knowledge.

    Instructions for the you:
    Output only valid JSObut as a string
   
        

    — no explanations, no extra text.
    and additionally add userAnswer as null

    The JSON must be an array of 20 objects.

Example output:

\`\`\`json
[
  {
    "id": "1",
    "question": "What is a closure in JavaScript?",
    "options": {
      "A": "A function without return",
      "B": "A block of code",
      "C": "A function that retains access to its lexical scope",
      "D": "A variable declaration"
    },
    "correctAnswer": "C",
    "userAnswer": null,
    "explanation": "Closures allow functions to retain access to variables from their scope even after the outer function has returned."
  }
]
\`\`\`

    `
    return prompt
    
}


function extractFromAIResponse( message  ) {
    console.log("➡️ Entered extractFromAIResponse");

    const match = message.match(/```json\s*([\s\S]*?)\s*```/);

    if (!match) {
        console.error("❌ Could not find JSON block in AI response.");
        throw new Error("Could not find JSON block in AI response.");
    }

    try {
        const parsed = JSON.parse(match[1].trim());
        console.log("✅ Parsed JSON from AI response successfully");
        return parsed;
    } catch (error) {
        console.error("❌ Failed to parse quiz JSON:", match[1], error);
        throw new Error("Invalid JSON format in AI response.");
    }
}


const getAnalysisPrompt = (userinput) => {

  const prompt = `A student was struggling with self-doubt in a particular skill. A student has completed a quiz on that particular skill. Based on his answers, provide a detailed analysis of his performance, highlighting strengths and areas for improvement. Offer personalized study tips to help him overcome self-doubt and build confidence in his knowledge of the skill.

    The student's answers are as follows: ${userinput}.

    Instructions for you:
    Output only valid JSON as a string
   
        

    — no explanations, no extra text.

    The JSON must be an object with the following structure:

Example output:

\`\`\`json
 {
        strengths: [
            "Strong foundational knowledge of JavaScript syntax",
            "Good understanding of basic programming concepts",
            "Quick grasp of variable declarations and data types",
            "Solid problem-solving approach for beginner-level challenges"
        ],
        areasForImprovement: [
            "Need more practice with asynchronous programming (Promises, async/await)",
            "Weak understanding of closures and scope chain",
            "Requires more exposure to array methods (map, filter, reduce)",
            "Should work on debugging skills and error handling"
        ],
        studyTips: [
            "Practice with real-world projects to understand async operations",
            "Build small applications using fetch API and Promises",
            "Solve coding challenges on platforms like LeetCode or HackerRank",
            "Review JavaScript documentation for array methods regularly",
            "Join coding communities to get code reviews and feedback"
        ],
        recommendedResources: [
            { title: "JavaScript.info - Async/Await tutorial", url: "https://javascript.info/async-await"},
            { title: "MDN Web Docs - Array methods", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"},
           { title: "Eloquent JavaScript - Chapter on Closures", url: "https://eloquentjavascript.net/13_closures.html"},
           { title: "FreeCodeCamp - JavaScript Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"},
        ],
        nextSteps: [
            "Complete 5 practice problems on closures",
            "Build a weather app using async/await",
            "Review array methods with interactive exercises",
            "Join JavaScript study group"
        ]
    }
\`\`\`

    `
    return prompt
    
}


const getRoadmapPrompt = (details) => {

  const prompt = `A student has been struggling with self-doubt in a specific skill area and has just completed a quiz related to that skill. Using the student's answers, create a detailed and personalized 5-day learning roadmap designed to help them build confidence and master the skill.
  Student details: ${details}
    `
}




export { getquizPrompt, extractFromAIResponse, getAnalysisPrompt, getRoadmapPrompt };