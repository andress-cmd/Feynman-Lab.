export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Método no permitido."});
  try {
    const {task,question,instruction,source,extra}=req.body||{};
    if(!source)return res.status(400).json({error:"No se recibió el contenido del documento."});

    const tasks={
      explicacion_simple:"Explica el concepto solicitado usando SOLO el documento. No copies el texto: reformúlalo. Incluye significado, explicación paso a paso, ejemplo cotidiano, analogía sencilla y qué recordar para un examen.",
      feynman:"Aplica la técnica Feynman: idea central, explicación para principiantes, términos difíciles, analogía, ejemplo cotidiano, posibles vacíos y resumen que el estudiante pueda repetir.",
      vida_cotidiana:"Relaciona los conceptos del documento con situaciones cotidianas reales, manteniendo el significado del material.",
      quiz:"Crea un quiz basado exclusivamente en el documento. Mezcla selección múltiple, verdadero/falso y preguntas abiertas. Incluye respuestas correctas y explicación breve.",
      exposicion:"Prepara una exposición clara basada exclusivamente en el documento: objetivo, introducción, ideas principales, explicación sencilla, ejemplos, conclusión y posibles preguntas.",
      tutor:"Actúa como tutor del documento. Responde la pregunta usando principalmente el contenido proporcionado y señala cuando algo no esté respaldado."
    };

    const prompt=`INSTRUCCIÓN DEL ESTUDIANTE:
${instruction||"Comprender y estudiar el documento."}

PREGUNTA:
${question||"Explica la idea principal."}

TAREA:
${tasks[task]||tasks.tutor}

${extra||""}

REGLAS:
- Usa SOLO el contenido del documento como fuente.
- No inventes datos.
- Si el documento no permite responder algo, dilo.
- Responde en español claro.
- No copies grandes fragmentos literalmente.
- Conserva los términos académicos importantes.

DOCUMENTO:
${source}`;

    const r=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||"gpt-5.6-luna",
        input:prompt,
        store:false
      })
    });
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data?.error?.message||"Error de la API de IA."});
    let text=data.output_text;
    if(!text&&Array.isArray(data.output)){
      text=data.output.flatMap(x=>(x.content||[]).map(c=>c.text||"")).filter(Boolean).join("\n");
    }
    return res.status(200).json({text:text||"La IA no devolvió texto."});
  }catch(e){return res.status(500).json({error:"Error interno: "+e.message});}
}