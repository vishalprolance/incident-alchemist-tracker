
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket, TicketType } from "@/contexts/TicketContext";

// Using the provided API key directly since it's a public API key for this demo
const API_KEY = "AIzaSyDzdRxEYKrbBzVzHpScWC4lVkuo89r8gsE";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeTicket(ticket: Ticket | Partial<Ticket>): Promise<string> {
  try {
    let prompt = "";
    
    switch (ticket.type) {
      case "incident":
        prompt = `
You are an experienced IT incident analyst. Please provide a comprehensive root cause analysis for the following incident:

Title: ${ticket.title}
Description: ${ticket.description}
Priority: ${ticket.priority}
Status: ${ticket.status}

Your analysis should include:
1. Potential root causes (list 3-4 possibilities in order of likelihood)
2. Diagnostic steps to confirm each potential cause
3. Recommended immediate actions to restore service
4. Long-term preventive measures
5. Key metrics to monitor to prevent similar incidents

Provide a clear, actionable report that would help an IT team quickly resolve this issue and prevent recurrence.
`;
        break;
        
      case "problem":
        prompt = `
You are an IT problem management specialist. Please analyze this problem ticket and suggest solutions:

Title: ${ticket.title}
Description: ${ticket.description}
Priority: ${ticket.priority}
Status: ${ticket.status}

Provide a thorough analysis with:
1. Most likely underlying causes of this recurring issue
2. Detailed solution recommendations (with specific steps)
3. Implementation approach (including testing methodology)
4. Success criteria for verifying the problem is fixed
5. Risk assessment of each suggested solution

Format your response as a professional problem resolution plan that could be immediately implemented.
`;
        break;
        
      case "change":
        prompt = `
You are a change management expert. Please provide a standard operating procedure for implementing this change:

Title: ${ticket.title}
Description: ${ticket.description}
Priority: ${ticket.priority}
Status: ${ticket.status}

Your SOP should include:
1. Detailed pre-implementation checklist
2. Step-by-step implementation procedure (with commands if applicable)
3. Verification and testing steps
4. Rollback procedure in case of failure
5. Post-implementation verification steps
6. List of potential systems impacted by this change

Present this as a formal change implementation plan that follows ITIL best practices.
`;
        break;
        
      default:
        prompt = `
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
    }

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
