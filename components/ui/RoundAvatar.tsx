import { Colors } from "@/constants/theme"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

const RoundAvatar = ({ url, onPress }: { url?: string, onPress?: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image
                source={{ uri: url }}
                style={styles.logo}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    logo: {
        borderWidth: 1,
        borderColor: Colors.primary,
        width: 50,
        height: 50,
        borderRadius: 50,
    }
})

export default RoundAvatar