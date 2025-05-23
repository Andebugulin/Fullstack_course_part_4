const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favourite blog', () => {
    
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.favoriteBlog([{
            _id: '5a422b891b54a676234d17f9',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 71,
            __v: 0
        }])
        assert.deepStrictEqual(result, {
            _id: '5a422b891b54a676234d17f9',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 71,
            __v: 0
        })
    }
    )
    test('of a bigger list is calculated right', () => {
        const listWithBlogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17f9',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 71,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 71,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234g17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra 2',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 1,
                __v: 0
            }
        ]
        const result = listHelper.favoriteBlog(listWithBlogs)
        try {
            assert.deepStrictEqual(result, {
                _id: '5a422b891b54a676234d17f9',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 71,
                __v: 0
            });
        } catch (error) {
            assert.deepStrictEqual(result,   {
                _id: '5a422b891b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 71,
                __v: 0
            });
        }
    }
)})