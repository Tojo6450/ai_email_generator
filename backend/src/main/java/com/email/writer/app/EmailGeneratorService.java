package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EmailGeneratorService
{
    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public Mono<String> generateEmailReply(EmailRequest emailRequest)
    {
        String prompt = buildPrompt(emailRequest);
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        return webClient.post()
                .uri(geminiApiUrl)
                .header("x-goog-api-key", geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).map(errorBody -> {
                            log.error("Gemini API error response: {}", errorBody);
                            return new RuntimeException("Gemini API error: " + errorBody);
                        })
                )
                .bodyToMono(String.class)
                .doOnNext(resp -> log.info("Raw Gemini response: {}", resp))
                .map(this::extractResponseContent)
                .doOnError(err -> log.error("Error calling Gemini API", err))
                .onErrorReturn("Error generating email reply.");
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
    StringBuilder prompt = new StringBuilder();
    String tone = emailRequest.getTone() != null ? emailRequest.getTone().toLowerCase() : "professional";

    String toneInstruction = switch (tone) {
        case "friendly" -> "Write a warm, casual, and friendly reply. Use approachable language and perhaps a friendly sign-off.";
        case "concise" -> "Write a very short, direct, and to-the-point reply. Avoid unnecessary fluff or long sentences.";
        case "formal" -> "Write a highly professional, respectful, and sophisticated reply. Use formal salutations and a polished structure.";
        default -> "Write a balanced professional and polite email reply.";
    };

    prompt.append("You are an expert email assistant. ").append(toneInstruction);
    prompt.append("\n\nRules:\n- Do not generate a subject line.\n- Focus only on the body of the email.");
    prompt.append("\n\nOriginal Email Content:\n").append(emailRequest.getEmailContent());
    prompt.append("\n\nGenerated ").append(tone.toUpperCase()).append(" Reply:");

    return prompt.toString();
}
}
