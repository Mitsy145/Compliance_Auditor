# Audio processing is handled on the frontend via Web Speech API
# This file is reserved for any server-side audio utilities if needed

def process_transcript(transcript: str) -> str:
    """Clean and normalize a speech transcript."""
    if not transcript:
        return ""
    # Basic cleanup
    transcript = transcript.strip()
    transcript = " ".join(transcript.split())
    return transcript