from flask import Flask
from flask_cors import CORS
import numpy as np
import pickle
import json
import string
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

def crossdomain(origin=None, methods=None, headers=None, max_age=21600,
                attach_to_all=True, automatic_options=True):
    """Decorator function that allows crossdomain requests.
      Courtesy of
      https://blog.skyred.fi/articles/better-crossdomain-snippet-for-flask.html
    """
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    # use str instead of basestring if using Python 3.x
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    # use str instead of basestring if using Python 3.x
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        """ Determines which methods are allowed
        """
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        """The decorator function
        """
        def wrapped_function(*args, **kwargs):
            """Caries out the actual cross domain code
            """
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator
  

@app.route('/0/<sentence>', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def hello_world0(sentence):
	return analyze(sentence, 0)

@app.route('/1/<sentence>', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def hello_world1(sentence):
	return analyze(sentence, 1)

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
	
	X_ex = vectorizer.transform([sentence]).toarray().squeeze()
	indices_ex = np.nonzero(X_ex)[0]
	weights_ex = weights[indices_ex]
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

if __name__ == '__main__':
    app.run(host='0.0.0.0')