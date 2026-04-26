const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/suggestions
const getSuggestions = async (req, res) => {
  try {
    const { resumeText, weakTopics, prepLevel, feedback } = req.body;

    if (!resumeText && !weakTopics && !prepLevel) {
      return res.status(400).json({ message: 'Please provide at least some context' });
    }

    const prompt = `You are an expert interview preparation coach. Based on the information below, provide structured improvement advice.

Resume Summary: ${resumeText || 'Not provided'}
Weak Topics: ${weakTopics || 'Not specified'}
Current Preparation Level: ${prepLevel || 'Not specified'}
Interview Feedback: ${feedback || 'Not provided'}

Respond ONLY with a valid JSON object in this exact format:
{
  "resumeTips": ["tip1", "tip2", "tip3"],
  "skillGaps": ["gap1", "gap2", "gap3"],
  "studyPlan": ["topic1", "topic2", "topic3"],
  "personalSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    // Parse JSON safely
    let suggestions;
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      suggestions = JSON.parse(jsonStr);
    } catch {
      // Fallback if parsing fails
      suggestions = {
        resumeTips: ['Quantify your achievements with numbers and metrics', 'Use action verbs at the start of bullet points', 'Tailor your resume keywords to each job description'],
        skillGaps: ['Review your weak topics systematically', 'Practice LeetCode problems daily', 'Build projects to demonstrate practical skills'],
        studyPlan: ['Data Structures & Algorithms (2 weeks)', 'System Design basics (1 week)', 'Company-specific prep (1 week)'],
        personalSuggestions: ['Set a consistent daily study schedule', 'Track your progress with mock interviews', 'Join study groups or communities'],
      };
    }

    res.json(suggestions);
  } catch (error) {
    console.error('Gemini Error:', error.message);
    // Fallback to mock data if API keys fail
    res.json({
      resumeTips: ['Quantify your achievements with numbers', 'Use action verbs at the start of bullet points', 'Tailor your resume keywords to the job description (Mock Data)'],
      skillGaps: ['Review your weak topics systematically', 'Practice algorithms daily', 'Build projects to demonstrate practical skills'],
      studyPlan: ['Data Structures & Algorithms (2 weeks)', 'System Design basics (1 week)', 'Company-specific prep (1 week)'],
      personalSuggestions: ['Set a consistent daily study schedule', 'Track your progress with mock interviews', 'Your API keys are invalid or out of quota. Please update them in the .env file!']
    });
  }
};

module.exports = { getSuggestions };
