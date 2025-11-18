async function enviar() {
    const input = document.getElementById("input").value;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBOic1v2mQLYaNiBjT8r-NjgnyKIT7hU44,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input }] }]
            })
        }
    );

    const data = await response.json();

    document.getElementById("resposta").innerText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro";
}