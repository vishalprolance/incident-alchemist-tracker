
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket, TicketType } from "@/contexts/TicketContext";

// Using the provided API key directly since it's a public API key for this demo
const API_KEY = "AIzaSyCCy-dgtUA8ng8cLHQ9ZFs_-BURfDFT-kk";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeTicket(ticket: Ticket | Partial<Ticket>): Promise<string> {
  try {
    const prompt = `
You are an IT service management AI assistant. Please analyze the following ${ticket.type} and provide actionable recommendations:

Title: ${ticket.title}
Description: ${ticket.description}
Priority: ${ticket.priority}
Status: ${ticket.status}

Provide a concise analysis with:
1. Potential root causes
2. Recommended immediate actions
3. Next steps for resolution
4. Prevention measures for similar issues
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing ticket with Gemini:", error);
    return "Unable to generate AI analysis at this time. Please try again later.";
  }
}

export async function getSuggestedActions(ticketType: TicketType, description: string): Promise<string> {
  try {
    const prompt = `
You are an IT service management AI assistant. A user is creating a new ${ticketType} with the following description:

"${description}"

Please suggest:
1. A more descriptive title (one line)
2. Priority level recommendation (low, medium, or high)
3. 2-3 immediate actions the IT team should take
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting suggestions from Gemini:", error);
    return "Unable to generate suggestions at this time. Please try again later.";
  }
}
