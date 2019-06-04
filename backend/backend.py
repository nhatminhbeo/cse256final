from flask import Flask
import numpy as np
import pickle
import json
import string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/<sentence>')
def hello_world(sentence):
	return analyze(sentence)

with open("vectorizer.pickle", "rb") as file:
    vectorizer = pickle.load(file)
vocabularies = [word for word, index in sorted(vectorizer.vocabulary_.items(), key=lambda x: x[1])]

with open("classifier.pickle", "rb") as file:
    classifier = pickle.load(file)
weights = classifier.coef_.squeeze()

def analyze(sentence):
	# Make the words lower case
	sentence_brief = sentence.lower()
	
	# Remove all punctuations
	for c in string.punctuation:
	    sentence_brief = sentence_brief.replace(c, " ")
	
	# Remove all single letter words
	sentence_brief = ' '.join([w for w in sentence_brief.split() if len(w) > 1] )
	
	X_ex = vectorizer.transform([sentence]).toarray().squeeze()
	indices_ex = np.nonzero(X_ex)[0]
	weights_ex = classifier.coef_.squeeze()[indices_ex]
	features_ex = X_ex[indices_ex]
	results_ex = weights_ex * features_ex
	
	grams = [{}, {}, {}]
	for i in np.argsort(results_ex)[::-1]:
	    token = vocabularies[indices_ex[i]]
	    indices = [i for i in range(len(sentence_brief)) if sentence_brief.startswith(token, i)]    
	    data = {'indices': indices, 'feature': features_ex[i], 'weights': weights_ex[i], 'product': results_ex[i]}
	    grams[len(token.split()) - 1][token] = data
	jsons = json.dumps(grams)

	return(jsons)
