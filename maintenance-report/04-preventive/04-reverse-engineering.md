# Reverse Engineering — Preventive Maintenance

## Recovered String Tokenization & Escaping Pipeline
Reverse engineering of the LaTeX string sanitization logic demonstrates why single-pass deterministic token mapping avoids unintended cascading transformations.

---

## State Transition Diagram: Multi-Pass vs Single-Pass (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> InputString: Raw User Text e.g. "C:\Users\{Project}"

    state "Flawed Multi-Pass Chaining" as FlawedPass {
        Pass1: Replace '\' -> '\textbackslash{}'
        Pass2: Replace '{' -> '\{' (Matches original AND newly created braces!)
        Pass3: Replace '}' -> '\}' (Matches original AND newly created braces!)
        
        Pass1 --> Pass2
        Pass2 --> Pass3
        CorruptedOutput: Result = "C:\textbackslash\{\}Users\{Project\}"
        Pass3 --> CorruptedOutput
    }

    state "Hardened Atomic Tokenizer" as HardenedPass {
        RegexEngine: Match regex /[\\&%$#_{}~^]/g
        DictionaryLookup: Map single token to LATEX_ESCAPE_MAP[char]
        ValidOutput: Result = "C:\textbackslash{}Users\{Project\}"
        
        RegexEngine --> DictionaryLookup
        DictionaryLookup --> ValidOutput
    }

    InputString --> FlawedPass: Legacy Execution
    InputString --> HardenedPass: Refactored Execution
```

---

## Recovered Exception Handling Model

```mermaid
flowchart TD
    TryBlock["Async Execution: Gemini / OpenRouter API Call"]
    CatchBlock["catch (error: unknown)"]
    TypeCheck{"error instanceof Error ?"}
    StandardMsg["msg = error.message"]
    FallbackMsg["msg = typeof error === 'string' ? error : 'Unexpected API error'"]
    JsonResponse["Return NextResponse.json({ error: msg }, { status: 500 })"]

    TryBlock -->|Throws Exception| CatchBlock
    CatchBlock --> TypeCheck
    TypeCheck -->|Yes| StandardMsg
    TypeCheck -->|No| FallbackMsg
    StandardMsg --> JsonResponse
    FallbackMsg --> JsonResponse
```
