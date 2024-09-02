import { Posts } from './types'
import { Users } from './types'

export const fakePosts: Posts[] = [{
    id: '0',
    postedBy: '0',
    postBody: 'szia1',
    postImage: new Blob([new Uint8Array([72, 101, 108, 108, 111])], { type: 'text/plain' }),
    views: 0,
    date: new Date('2023-07-24T15:30:00'),
    like: 0,
    comment: 0
}, {
    id: '1',
    postedBy: '0',
    postBody: 'szia2',
    postImage: new Blob([new Uint8Array([72, 101, 108, 108, 111])], { type: 'text/plain' }),
    views: 0,
    date: new Date('2023-07-24T15:30:00'),
    like: 0,
    comment: 0
}]

export const fakeUsers: Users[] = [{
    id: '12345',
    name: 'test name',
    birth: '2000-01-01',
    proilePic: '',
    followers: 0
}, {
    id: '1',
    name: 'test name1',
    birth: '2000-01-01',
    proilePic: '',
    followers: 0
}]

