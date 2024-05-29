"use client"


import { Document, View, Page, Text, PDFDownloadLink, StyleSheet, PDFViewer } from "@react-pdf/renderer"
import React, { useEffect, useRef } from "react"
import Moment from 'moment'


interface PageProps {
    notes: {
        id: string,
        fileId: string,
        notes: string,
        updatedAt: string | null;
    } | null | undefined,
    fileName: string
}


const PDFDocument = ({ notes, fileName }: PageProps) => {
    console.log("NOTE PDF = ", notes)
    const styles = useRef(StyleSheet.create({
        page: {
            backgroundColor: 'white',
            padding: 20
        },
        section: {
            margin: 5,
            padding: 5,
            fontSize: '10px'
        },
        viewer: {
            width: window.innerWidth,
            height: window.innerHeight,
        },

        header: {
            fontSize: '15px',
            textAlign: 'center',
            marginBottom: '20px',
            margin: 20,
            padding: 10,
        },
        messageLine: {
            paddingBottom: "10px"
        }
    }))

    return (
        <Document>
            <Page size="A4" style={styles.current?.page}>
                <View>
                    <h2>
                        <Text style={styles.current.header}>Notes for Document: {fileName}</Text>
                    </h2>
                </View>
                <br />
                {notes?.notes ? (
                    <div>
                        <View style={styles.current.section}>
                            <Text style={styles.current.messageLine}>
                                {notes.notes}
                            </Text> <br /><br />
                            <Text style={styles.current.messageLine}>Updated At: {Moment(notes?.updatedAt).format('DD MMM YYYY')}</Text><br /><br />
                        </View>
                    </div>
                ) : null
                }
                {/* {file.messages && file.messages.map((message: Message) => (
                    <div key={message.id}>
                        <View key={message.id} style={styles.current.section}>
                            <Text style={styles.current.messageLine}>
                                {message.isUserMessage ? "Question" : "Answer"} : {message.text}
                            </Text> <br /><br />
                            <Text style={styles.current.messageLine}>CreatedAt: {Moment(message.createdAt).format('DD MMM YYYY')}</Text><br /><br />
                        </View>
                    </div>
                ))} */}
            </Page>
        </Document>
    )
}

export default PDFDocument