import json as JSON

def decodeJson(path):
    with open(path, 'r') as f:
        return JSON.loads(f.read())

def matchingKeyIter(json, key):
    for (k, v) in json.items():
        if k == key:
            yield v
        elif type(v) == dict:
            for v in matchingKeyIter(v, key):
                yield v

path = './things.json'
json = decodeJson(path)

# Scrape slots
slots = set([v
    for slots in matchingKeyIter(json, 'slots')
    for v in slots
])
print(sorted(list(slots)))

# Scrape reagents
# reagents = set([k
#     for pairs in matchingKeyIter(json, 'createdReagents')
#     for k in pairs.keys()
# ])
# print(sorted(list(reagents)))
