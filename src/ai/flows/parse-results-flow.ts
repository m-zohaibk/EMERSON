
'use server';
/**
 * @fileOverview A Genkit flow that uses AI to parse messy university result text
 * into structured AcademicResult objects. It handles multi-line headers,
 * split subject codes, and variable column structures with high precision.
 * Now specifically handles SGPA and CGPA columns.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseResultsInputSchema = z.object({
  rawText: z.string().describe('The raw text extracted from a result PDF or Excel file.'),
  semesterOverride: z.string().optional().describe('An optional semester to use if not detectable from text.'),
});
export type ParseResultsInput = z.infer<typeof ParseResultsInputSchema>;

const AcademicResultSchema = z.object({
  rollNumber: z.string(),
  semester: z.string(),
  gpa: z.number().describe('SGPA (Semester GPA)'),
  cgpa: z.number().optional().describe('CGPA (Cumulative GPA)'),
  subjects: z.array(z.object({
    name: z.string(),
    grade: z.string(),
    status: z.string(),
  })),
});

const ParseResultsOutputSchema = z.object({
  results: z.array(AcademicResultSchema),
});
export type ParseResultsOutput = z.infer<typeof ParseResultsOutputSchema>;

const parseResultsPrompt = ai.definePrompt({
  name: 'parseResultsPrompt',
  input: { schema: ParseResultsInputSchema },
  output: { schema: ParseResultsOutputSchema },
  prompt: `You are an expert academic data processor for Emerson University Multan.
Your task is to convert raw, messy text extracted from result sheets (PDF/Excel) into structured JSON records.

INPUT TEXT:
{{{rawText}}}

{{#if semesterOverride}}
SEMESTER OVERRIDE: {{{semesterOverride}}}
{{/if}}

STRICT PARSING INSTRUCTIONS:
1. IDENTIFY SEMESTER: Search for headers like "1st SEMESTER", "2nd SEMESTER", etc.
2. EXTRACT STUDENT ROWS:
   - Each row starts with a serial number, followed by a Roll Number (e.g., COSC231112101).
   - Columns typically end with [SGPA] [CGPA] [Remarks].
   - If there is only one decimal number before the remarks, it is SGPA.
   - If there are two decimal numbers before the remarks, the first is SGPA and the second is CGPA.
   - Example: "... 3.71 3.59 Promoted" -> SGPA=3.71, CGPA=3.59.
3. SUBJECTS: Map numeric grades to their subject headers. If headers are split (e.g. "COSC-" and "2206"), merge them.
4. CGPA: Always extract CGPA if it exists in the row. Set it in the 'cgpa' field.
5. FALLBACK: If CGPA column is missing (common in 1st semester), only set 'gpa' (SGPA).

Return ONLY the JSON object.`,
});

const parseResultsFlow = ai.defineFlow(
  {
    name: 'parseResultsFlow',
    inputSchema: ParseResultsInputSchema,
    outputSchema: ParseResultsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await parseResultsPrompt(input);
      if (!output) {
        throw new Error('AI returned an empty response.');
      }
      return output;
    } catch (e: any) {
      console.error("Parse Flow Error:", e);
      throw new Error(`AI Parsing Error: ${e.message}`);
    }
  }
);

export async function parseResultsWithAI(input: ParseResultsInput): Promise<ParseResultsOutput> {
  return parseResultsFlow(input);
}
