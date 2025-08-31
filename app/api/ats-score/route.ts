import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import natural from 'natural';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single('resume'));

export async function POST(req: NextRequest) {
  try {
    // Handle file upload
    await uploadMiddleware(req as any, null as any);
    const body = req.body as any;
    const resumeFile = (req as any).file;
    const jobDescription = body.jobDescription;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 });
    }

    // Parse resume based on file type
    let resumeText = '';
    if (resumeFile.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(resumeFile.buffer);
      resumeText = pdfData.text;
    } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const docxData = await mammoth.extractRawText({ buffer: resumeFile.buffer });
      resumeText = docxData.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Clean and tokenize texts
    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;

    const resumeTokens = tokenizer.tokenize(resumeText.toLowerCase()).map(stemmer.stem);
    const jobTokens = tokenizer.tokenize(jobDescription.toLowerCase()).map(stemmer.stem);

    // Compute TF-IDF for better scoring
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(resumeTokens);
    tfidf.addDocument(jobTokens);

    // Calculate similarity (cosine similarity)
    const similarity = tfidf.tfidfs(resumeTokens, (i: number, measure: number) => {
      if (i === 0) return measure;
    })[0];

    // Normalize to percentage
    const score = Math.min(Math.max(similarity * 100, 0), 100);

    return NextResponse.json({ score: Math.round(score) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}