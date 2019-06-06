from flask import Flask, request, send_from_directory
from flask_cors import CORS
import numpy as np
import pickle
import json
import string
app = Flask(__name__, static_url_path='/')
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/0/<sentence>', methods=['GET', 'OPTIONS'])
def hello_world0(sentence):
	return analyze(sentence, 0)
  
@app.route('/0/', methods=['GET', 'OPTIONS'])
def hello_world0empty():
	return analyze('', 0)
  
@app.route('/1/<sentence>', methods=['GET', 'OPTIONS'])
def hello_world1(sentence):
	return analyze(sentence, 1)
  
@app.route('/1/', methods=['GET', 'OPTIONS'])
def hello_world1empty():
	return analyze('', 1)
  
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response
  
with open("vectorizer_pa2.pickle", "rb") as file:
    vectorizer_pa2 = pickle.load(file)
vocabularies_pa2 = [word for word, index in sorted(vectorizer_pa2.vocabulary_.items(), key=lambda x: x[1])]

with open("classifier_pa2.pickle", "rb") as file:
    classifier_pa2 = pickle.load(file)
weights_pa2 = classifier_pa2.coef_.squeeze()

with open("vectorizer_imdb.pickle", "rb") as file:
    vectorizer_imdb = pickle.load(file)
vocabularies_imdb = [word for word, index in sorted(vectorizer_imdb.vocabulary_.items(), key=lambda x: x[1])]

with open("classifier_imdb.pickle", "rb") as file:
    classifier_imdb = pickle.load(file)
weights_imdb = classifier_imdb.coef_.squeeze()

def analyze(sentence, dataset):
	# Select models based on the dataset
	if dataset == 0:
		vectorizer = vectorizer_pa2
		vocabularies = vocabularies_pa2
		classifier = classifier_pa2
		weights = weights_pa2
	else:
		vectorizer = vectorizer_imdb
		vocabularies = vocabularies_imdb
		classifier = classifier_imdb
		weights = weights_imdb

	# Make the words lower case
	sentence_brief = sentence.lower()
	
	# Remove all punctuations
	for c in string.punctuation:
	    sentence_brief = sentence_brief.replace(c, " ")
	
	# Remove all single letter words
	sentence_brief = ' '.join([w for w in sentence_brief.split() if len(w) > 1] )
	raw_X_ex = vectorizer.transform([sentence])
	confidence = classifier.predict_proba(raw_X_ex).squeeze().tolist()
	
	X_ex = raw_X_ex.toarray().squeeze()
	indices_ex = np.nonzero(X_ex)[0]
	weights_ex = weights[indices_ex]
	features_ex = X_ex[indices_ex]
	results_ex = weights_ex * features_ex
	
	grams = [{}, {}, {}, confidence]
	for i in np.argsort(results_ex)[::-1]:
	    token = vocabularies[indices_ex[i]]
	    indices = [i for i in range(len(sentence_brief)) if sentence_brief.startswith(token, i)]    
	    data = {'indices': indices, 'feature': features_ex[i], 'weights': weights_ex[i], 'product': results_ex[i]}
	    grams[len(token.split()) - 1][token] = data
	jsons = json.dumps(grams)

	return(jsons)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)