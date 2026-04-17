# Ollama Integration Guide

**VCSA Coach now powered by Ollama (Local LLM)** 🤖

---

## Overview

VCSA Coach now uses **Ollama**, a local LLM platform, instead of cloud APIs. This means:
- ✅ **100% Private** - All data stays on your machine
- ✅ **No API Costs** - Free forever
- ✅ **Fast Responses** - No network latency
- ✅ **Customizable** - Use any model you want
- ✅ **Offline Capable** - Works without internet

---

## Prerequisites

### 1. Install Ollama

**macOS**:
```bash
brew install ollama
```

**Linux**:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows**:
Download from: https://ollama.com/download

### 2. Start Ollama

```bash
ollama serve
```

Ollama will start on `http://localhost:11434`

### 3. Pull a Model

**Recommended Models**:
```bash
# Llama 3.1 (8B) - Best balance of speed and quality
ollama pull llama3.1

# Mistral (7B) - Fast and efficient
ollama pull mistral

# Gemma 3 (4B) - Lightweight
ollama pull gemma3
```

**Other Available Models**:
- `llama3` - Llama 3 (8B)
- `codellama` - Code specialization
- `neural-chat` - Fine-tuned for conversations
- `phi3` - Microsoft's 3.8B model

---

## Configuration

### Environment Variables (Optional)

Create `/backend/.env`:
```bash
# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3.1

# Options: llama3, llama3.1, mistral, gemma3, codellama, etc.
```

### Model Selection

**For Best Results**:
- **Speed**: `gemma3` (4B parameters)
- **Quality**: `llama3.1` (8B parameters)
- **Balance**: `mistral` (7B parameters)

**Change Model**:
```bash
# Edit backend/.env
OLLAMA_MODEL=mistral

# Restart backend
docker restart vcsa-backend
```

---

## How It Works

### Architecture

```
User → Frontend → Backend API → Ollama (Local)
                    ↓
              Your Data + Context
                    ↓
              Ollama Llama3.1
                    ↓
              Personalized Response
```

### Data Flow

1. **User asks question** in frontend chat
2. **Backend loads user context**:
   - Financial goals
   - Sales performance
   - Today's progress
   - Recent sales
3. **Backend builds prompt** with all context
4. **Ollama generates response** using local LLM
5. **Response returned** to frontend

---

## API Integration

### Ollama API Call

```python
async with httpx.AsyncClient(timeout=60.0) as client:
    response = await client.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.1",
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 512
            }
        }
    )
```

### Prompt Structure

```
=== SYSTEM PROMPT (with user data) ===
- User: John Doe
- Goal: $15,000
- Progress: 18 sales ($32,231)
- Today: 3/7 attributes

=== CONVERSATION HISTORY ===
USER: ¿Cómo voy en mis metas?
ASSISTANT: [previous response]

=== CURRENT QUESTION ===
USER: ¿Qué debo hacer hoy?

=== RESPONSE ===
ASSISTANT: [Ollama generates response]
```

---

## Testing

### 1. Test Ollama Directly

```bash
# Simple test
curl http://localhost:11434/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1",
    "prompt": "Hola, ¿cómo estás?",
    "stream": false
  }'
```

### 2. Test Backend Endpoint

```bash
# Login first
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@vcsa.com", "password": "demo123"}' \
  -c /tmp/cookies.txt

# Test assistant
curl -X POST http://localhost:8001/api/assistant/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "message": "¿Cómo voy en mis metas?",
    "conversation_history": []
  }'
```

### 3. Test in Frontend

1. Open `http://localhost`
2. Login as demo user
3. Click floating [🤖] button
4. Ask: "¿Cómo voy en mis metas?"
5. See personalized response with your data!

---

## Model Comparison

### llama3.1 (Recommended)

**Pros**:
- ✅ Best quality responses
- ✅ Good Spanish understanding
- ✅ Excellent reasoning
- ✅ 8B parameters (fast)

**Cons**:
- ❌ Requires 4.9GB RAM
- ❌ Slightly slower than smaller models

**Best For**: Production use, best quality

---

### mistral

**Pros**:
- ✅ Very fast responses
- ✅ Good quality
- ✅ 7B parameters

**Cons**:
- ❌ Less Spanish fluency
- ❌ May need more context

**Best For**: Speed-focused applications

---

### gemma3

**Pros**:
- ✅ Fastest responses
- ✅ Only 4.3B parameters
- ✅ 3.3GB RAM required

**Cons**:
- ❌ Lower quality reasoning
- ❌ May miss nuances

**Best For**: Testing, resource-constrained systems

---

## Performance Tuning

### Temperature (Creativity)

```python
"options": {
    "temperature": 0.7  # 0.0 (precise) to 1.0 (creative)
}
```

**Recommendations**:
- `0.3-0.5`: Factual responses (numbers, data)
- `0.7-0.9`: Creative responses (motivation, ideas)

### Top P (Variety)

```python
"options": {
    "top_p": 0.9  # 0.0 (focused) to 1.0 (diverse)
}
```

**Recommendations**:
- `0.7-0.9`: Allow some variety
- `0.5-0.7`: More focused responses

### Max Tokens (Length)

```python
"options": {
    "max_tokens": 512  # Response length
}
```

**Recommendations**:
- `256-384`: Short answers (quick tips)
- `512-768`: Detailed responses (coaching)
- `1024+`: Long explanations (training)

---

## Troubleshooting

### Issue: "Ollama not available"

**Symptoms**:
- Generic fallback responses only
- No personalized insights

**Solutions**:
1. Check Ollama is running: `ollama list`
2. Verify URL: `curl http://localhost:11434/api/tags`
3. Check backend logs: `docker logs vcsa-backend`

### Issue: Slow responses

**Symptoms**:
- Responses take 10+ seconds
- Timeout errors

**Solutions**:
1. Use smaller model: `gemma3`
2. Reduce `max_tokens`: 256 instead of 512
3. Check system resources: `htop`

### Issue: Poor Spanish

**Symptoms**:
- Responses in English
- Wrong grammar

**Solutions**:
1. Use `llama3.1` (best Spanish)
2. Add to prompt: "Siempre responde en español"
3. Use more specific Spanish prompts

### Issue: Model not found

**Symptoms**:
- Error: "model 'llama3.1' not found"

**Solutions**:
```bash
# Pull the model
ollama pull llama3.1

# Or use available model
# Edit backend/.env: OLLAMA_MODEL=mistral
docker restart vcsa-backend
```

---

## Advanced Configuration

### Custom Model Options

Edit `/backend/claude_routes.py`:

```python
"options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 512,
    "repeat_penalty": 1.1,  # Avoid repetition
    "top_k": 40,           # Limit token choices
    "num_ctx": 4096,       # Context window
    "num_thread": 4        # CPU threads
}
```

### System Prompt Customization

Edit `build_system_prompt()` function to:
- Change personality
- Add more capabilities
- Modify response style
- Add platform-specific knowledge

---

## Updating Ollama

### Check for Updates

```bash
ollama --version
```

### Update Ollama

```bash
# macOS
brew upgrade ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
Re-run installer from website
```

### Update Models

```bash
# Update specific model
ollama pull llama3.1

# List installed models
ollama list
```

---

## Monitoring

### Check Model Usage

```bash
# Current model status
ollama ps

# Model info
ollama show llama3.1
```

### Backend Logs

```bash
# Check for Ollama errors
docker logs vcsa-backend | grep -i ollama

# Check assistant requests
docker logs vcsa-backend | grep -i assistant
```

### Performance Metrics

Monitor in backend logs:
- Response time
- Token usage
- Error rate
- Model accuracy

---

## Migration from Cloud API

### Before (Claude API)

- ✅ Required API key
- ✅ Internet connection needed
- ✅ Per-token pricing
- ✅ Data sent to cloud

### After (Ollama)

- ✅ No API key needed
- ✅ Works offline
- ✅ 100% free
- ✅ Private (local only)

---

## Best Practices

### 1. Model Selection

**Development**: `gemma3` (fast)
**Staging**: `mistral` (balanced)
**Production**: `llama3.1` (best quality)

### 2. Prompt Engineering

- Be specific and concise
- Include all relevant context
- Use Spanish for Spanish users
- Test with different temperatures

### 3. Error Handling

- Always have fallback responses
- Catch connection errors
- Provide helpful error messages
- Log issues for debugging

### 4. Performance

- Cache user context
- Limit conversation history
- Use appropriate token limits
- Monitor response times

---

## Examples

### Example 1: Goal Tracking

**Question**: "¿Cómo voy en mis metas?"

**Ollama Response** (with your data):
```
🎯 **Goal Progress Update**

Your current progress:
✅ Sales: 18/15 (3 ahead!)
✅ Volume: $32,231 of $15,000
⏰ 29 days remaining

Excellent work! You're $17,231 ahead (215% of goal).
Keep the momentum going! 💪
```

### Example 2: Sales Tips

**Question**: "Dame un consejo de ventas"

**Ollama Response**:
```
💡 **Sales Strategy for Today**

Based on your 18 sales ($1,790 avg):

1. **Enfócate en prospects de $2,000+**
   - Tu promedio es alto, apunta más alto
   - Usa "Value Building" techniques
   - Destaca beneficios, no características

2. **Maneja objeciones temprano**
   - "Entiendo que la inversión es importante"
   - "Compare esto con el valor a largo plazo"

3. **Logra 7 atributos hoy**
   - Daily Combo = +100 puntos bonus
   - Ya llevas 3/7 completados

¡Tú puedes lograr tu meta hoy! 🔥
```

---

## Support

### Ollama Documentation
- Website: https://ollama.com
- GitHub: https://github.com/ollama/ollama
- Docs: https://github.com/ollama/ollama/blob/main/README.md

### Model Library
- Available models: https://ollama.com/library
- Model file: https://ollama.com/library/llama3.1

### Troubleshooting
- Issues: https://github.com/ollama/ollama/issues
- Discord: https://discord.gg/ollama

---

## Conclusion

**VCSA Coach + Ollama = Perfect Match** 🎯

✅ **Privacy**: All data stays local
✅ **Cost**: $0 forever
✅ **Speed**: No network latency
✅ **Quality**: Llama 3.1 is excellent
✅ **Control**: Use any model you want

**Ready to use!** Click the [🤖] button in the bottom-right corner of any dashboard page. 🚀

---

**Last Updated**: 2026-04-01
**Version**: 2.0.0 (Ollama Integration)
**Status**: Active ✅
