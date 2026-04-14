import { ObjectId } from "mongodb";
import {client,MONGO_DATABASE} from '../index.js'


const getFeed = async (userId, limit = 10, skip = 0) =>{
    const following = await client
    .db(MONGO_DATABASE)
    .collection('follows')
    .find({
        followerId: new ObjectId (userId)
    })
    .toArray()
    const followingIds = following.map(f => 
        new ObjectId(f.followingId)
    )

    const posts = await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .find({
        userId: {$in: followingIds}
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .toArray()

    return posts
}

export default { getFeed };