package com.hq.chat.controllers;

import com.hq.chat.dto.UsersDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/signal")
@Slf4j
public class SignalingHandler extends TextWebSocketHandler {
    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Add the new session to the sessions map
        sessions.put(session.getId(), session);
        log.info("New session established: {}", session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("Received message: {}", payload);
        sessions.values().forEach(s -> {
            try {
                s.sendMessage(new TextMessage(payload));
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Remove the session from the sessions map
        sessions.remove(session.getId());
        log.info("Session closed: {}", session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // Handle any errors and remove the session if needed
        log.error("Transport error for session: {}", session.getId());
        sessions.remove(session.getId());
    }

    @GetMapping("/clients")
    public ResponseEntity<UsersDto> getCurrentClients() {
        List<UsersDto.User> users = new ArrayList<>();
        sessions.forEach((key, value) -> {
            UsersDto.User user = UsersDto.User.builder().id(key).sessionId(value.getId()).build();
            users.add(user);
        });
        return ResponseEntity.ok(UsersDto.builder().userList(users).build());
    }
}
