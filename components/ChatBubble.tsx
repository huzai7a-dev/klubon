import { Colors } from "@/constants/theme";
import React from "react";
import { Bubble, BubbleProps, IMessage } from "react-native-gifted-chat";

export const ChatBubble = (props: BubbleProps<IMessage>) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: Colors.primary,
                    borderRadius: 20,
                    borderBottomRightRadius: 4,
                    padding: 2,
                },
                left: {
                    backgroundColor: Colors.white,
                    borderRadius: 20,
                    borderBottomLeftRadius: 4,
                    padding: 2,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                },
            }}
            textStyle={{
                right: {
                    color: Colors.white,
                    fontSize: 15,
                    lineHeight: 20,
                },
                left: {
                    color: Colors.text,
                    fontSize: 15,
                    lineHeight: 20,
                },
            }}
        />
    );
};
