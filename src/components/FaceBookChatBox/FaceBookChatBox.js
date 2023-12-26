import React from 'react'
import { CustomChat, FacebookProvider } from 'react-facebook'

function FaceBookChatBox() {

    console.log("dã vo")

    return (
        <FacebookProvider appId="1325947341377754" chatSupport>
            <CustomChat pageId="198008766726901" minimized={false} />
        </FacebookProvider>
    )
}

export default FaceBookChatBox