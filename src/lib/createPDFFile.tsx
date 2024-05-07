import ReactPDF, { Document, View, Page, Text, PDFDownloadLink, StyleSheet } from "@react-pdf/renderer"
import React from "react"

interface PageProps {
    messages: []
}
interface Message {
    id: string
    text: string
    isUserMessage: boolean
    createdAt: string
}
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const PDFDocument = ({ messages }: PageProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {messages && messages.map((message: Message) => (
                <View key={message.id} style={styles.section}>
                    <Text>Message: {message.text}</Text>
                    <Text>CreatedAt: {message.createdAt}</Text>
                    <Text>isUserMessage: {message.isUserMessage}</Text>
                </View>
            ))}
        </Page>
    </Document>
)

export default PDFDocument