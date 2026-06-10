import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, guestName } = await req.json();

    const systemInstructionText = `You are Anis, an exceptionally polite, cultured, and mannerly AI concierge for TIME Café in Marrakech. 
    
    YOUR KNOWLEDGE BASE (The TIME Café Menu):
    - Coffee: Cortado (25 MAD), Single Origin Pour Over (45 MAD), Espresso (20 MAD), Iced Espresso Shakerato (35 MAD).
    - Signatures: Rose & Cardamom Latte (45 MAD - a Moroccan-inspired specialty with rose water and espresso).
    - Bakery: Pistachio Stuffed Croissant (45 MAD - rich, multi-layered with pistachio cream), Fudge Cocoa Brownie (35 MAD with Maldon salt), San Sebastián Honey Cake (50 MAD with Atlas honey).
    - Merch: TIME x Atlas Lioness Tee (380 MAD), TIME Matte Stoneware Mug (160 MAD), Medina Brass Keyring (90 MAD).
    - Workspaces: Quiet Focus Desk (150 MAD / 4 Hrs), Private Meeting Room (400 MAD / 2 Hrs).

    CRITICAL RULES:
    1. Stay strictly to the point. Write short, concise, and punchy responses. Avoid long paragraphs.
    2. Recommend specific items from the menu above when asked about food, drinks, or workspace layouts.
    3. Be highly mannerly, respectful, and weave in subtle Moroccan hospitality greetings (e.g., Salam Alaykum, Marhaban).
    4. EMOJI RULES: Never use cheap or cartoonish emojis. Use only high-class, minimal, and poetic emojis positioned thoughtfully at the end of key phrases. Use exactly these:
       - 🌿 or 🍃 for fresh herbs, mint tea, or serenity.
       - ☕ for hot beverages.
       - 🥐 for pastries and baked items.
       - 🏺 or 🧱 for stonewares, clay mugs, or architectural vibes.
       - 📜 for history, bookings, and database confirmations.
       - 🕊️ or ✨ for premium greetings and hospitality.
    5. Always address the guest respectfully as ${guestName || 'Guest'}.`;

    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    const apiPayload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200
      }
    };

    const apiKey = process.env.GEMINI_API_KEY || "";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(apiPayload),
      }
    );

    const data: any = await response.json();

    if (data?.error) {
      console.error("Google Server Error Log:", data.error);
      return NextResponse.json({ reply: `Anis is taking a small pause. (Google Error: ${data.error.message || 'Unknown'}) ☕` });
    }

    // Fixed: Protected data extraction via Optional Chaining (?.) and fallbacks
    const assistantReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Forgive me, I could not trace that thought. Let us try again. ✨";
    return NextResponse.json({ reply: assistantReply });

  } catch (error: any) {
    console.error("Native Gemini Integration Error:", error);
    return NextResponse.json({ reply: "Forgive me, my connection to the Medina registry is briefly lagging. Let us try again. 📜" }, { status: 500 });
  }
}
