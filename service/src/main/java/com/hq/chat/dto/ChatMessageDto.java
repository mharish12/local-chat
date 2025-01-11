package com.hq.chat.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class ChatMessageDto {
    private String content;
    private String sender;
    private String type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
