import asyncio
import os
import edge_tts

PROMPTS = [
    {
        "id": "core-rs-1",
        "voice": "en-CA-LiamNeural",
        "rate": "+0%",
        "text": "The main campus library will extend its opening hours during the upcoming examination period."
    },
    {
        "id": "core-rts-1",
        "voice": "en-CA-ClaraNeural",
        "rate": "+0%",
        "text": "You are travelling on a business trip to Vancouver. Your connecting flight has just been delayed by four hours due to adverse weather conditions, meaning you will miss an important evening dinner meeting with a key client."
    },
    {
        "id": "core-asq-1",
        "voice": "en-US-JennyNeural",
        "rate": "+0%",
        "text": "What document is issued by a vendor to a buyer requesting payment for goods or services supplied?"
    },
    {
        "id": "core-sst-1",
        "voice": "en-US-GuyNeural",
        "rate": "-3%",
        "text": "Artificial intelligence diagnostic algorithms are demonstrating remarkable speed and accuracy in interpreting radiographic scans and MRI imaging. By rapidly scanning through tens of thousands of past pathology scans, machine learning models can identify micro-tumors and subtle vascular anomalies far earlier than standard manual evaluations. Nevertheless, clinical ethicists emphasize that AI should serve as an assistive decision-support tool rather than an autonomous replacement for trained medical physicians."
    },
    {
        "id": "core-hiw-1",
        "voice": "en-GB-SoniaNeural",
        "rate": "+0%",
        "text": "Environmental economists conclude that severe droughts are increasingly driving rural communities toward urban centers in search of economic stability."
    },
    {
        "id": "core-smw-1",
        "voice": "en-GB-RyanNeural",
        "rate": "+0%",
        "text": "Sustainable architecture emphasizes building materials that reduce operational lifecycle emissions and foster long-term environmental..."
    },
    {
        "id": "core-wfd-1",
        "voice": "en-AU-WilliamMultilingualNeural",
        "rate": "+0%",
        "text": "All international applicants must submit their verified documentation before the priority deadline."
    },
    {
        "id": "acad-rs-1",
        "voice": "en-GB-SoniaNeural",
        "rate": "+0%",
        "text": "Scholarly citations must be formatted accurately according to the departmental publication guidelines."
    },
    {
        "id": "acad-rtl-1",
        "voice": "en-AU-NatashaNeural",
        "rate": "-3%",
        "text": "Ocean acidification occurs when atmospheric carbon dioxide dissolves into seawater, forming carbonic acid and decreasing oceanic pH levels. Marine biologists have documented that this chemical shift severely impedes coral calcification and disrupts calcareous shell formation among mollusks, destabilizing global aquatic trophic pyramids."
    },
    {
        "id": "acad-wfd-1",
        "voice": "en-US-GuyNeural",
        "rate": "+0%",
        "text": "Quantitative research methodologies require rigorous empirical verification to establish statistical significance."
    },
    {
        "id": "core-ra-model",
        "voice": "en-CA-LiamNeural",
        "rate": "+0%",
        "text": "Modern urban planning increasingly prioritizes integrated public transit networks over individual automobile reliance. Cities that invest in efficient rail, cycling corridors, and pedestrian zones demonstrate measurable reductions in carbon emissions and marked improvements in public health."
    },
    {
        "id": "acad-ra-model",
        "voice": "en-GB-RyanNeural",
        "rate": "+0%",
        "text": "Quantum computing exploits the fundamental principles of quantum mechanics, utilizing superposition and entanglement to perform complex computations at speeds that exponentially surpass traditional silicon microprocessors."
    }
]

async def generate():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "prompts")
    os.makedirs(out_dir, exist_ok=True)
    
    for item in PROMPTS:
        file_path = os.path.join(out_dir, f"{item['id']}.mp3")
        if os.path.exists(file_path) and os.path.getsize(file_path) > 1000:
            print(f"Skipping {item['id']}.mp3 (already exists, {os.path.getsize(file_path)} bytes)")
            continue
            
        print(f"Generating {item['id']}.mp3 with voice {item['voice']}...")
        success = False
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"])
                await communicate.save(file_path)
                print(f"Saved {file_path} ({os.path.getsize(file_path)} bytes)")
                success = True
                break
            except Exception as e:
                print(f"Attempt {attempt+1} failed: {e}")
                await asyncio.sleep(2)
        if not success:
            print(f"Failed to generate {item['id']}.mp3 after 3 attempts.")

if __name__ == "__main__":
    asyncio.run(generate())
