import os
import requests

import torch
import torch.nn as nn

class EngineController():
    def __init__(self):
        # Google Drvie Downloader
        self.downloader = GoogleDriveDownloader()

        self.file_path = self.get_file_path("model.pt")
        self.model_id = "1DvRL_-m3AibcQZZ6l2lUCfCqA6OTFdvV"

        # Check for model file
        self.checkModel()

        # Initialize model
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.load_model()

    # calculate probability
    def run(self, payload):
        # 1. preprocess data
        x = self.preprocess(payload)
        
        # 2. feed-forward data
        y = self.model(x)
        
        # 3. re-furnish result
        y = y.detach().numpy()
        y = y[0][0] * 100 # to percentage
        y = "{0:.2f}".format(y)

        return y

    # preprocess payload to torch Tensor
    def preprocess(self,payload):
        x = payload["data"]
        x = x.split(" ")
        result = []
        for n in x:
            try:
                result.append(float(n))
            except:
                pass
        result = torch.Tensor(result).to(self.device)
        result = result.unsqueeze(0) # batchsize 1

        return result

    # check if model file exits
    # if not download
    def checkModel(self):
        # 1. check if file exists
        if not os.path.isfile(self.file_path):
            # 2. if not exist download model
            self.downloadModel()

    # download model
    def downloadModel(self):
        self.downloader.download(self.model_id, self.file_path)

    def get_file_path(self, name):
        cur_dir = os.path.dirname(os.path.realpath(__file__))
        cur_dir = os.path.join(cur_dir, "model", name)
        return cur_dir

    def load_model(self):
        # load blank model object
        model = V1(in_size=18, out_size=1).to(self.device)
        model = model.eval()

        # get state_dict from file
        state_dict = torch.load(self.file_path, map_location=self.device)

        # load state dict
        model.load_state_dict(state_dict)
        return model


# Version 1 Model
class V1(nn.Module):
    def __init__(self, in_size, out_size):
        super(V1, self).__init__()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # input layer
        self.in_layer = nn.Linear(in_size, 50)
        
        # sequential layer
        self.net = nn.Sequential(
                nn.Linear(50,50),
                nn.ReLU(),
                nn.Linear(50,50),
                nn.ReLU(),
                nn.Linear(50,50),
                nn.ReLU()
                )
        
        
        # output layer
        self.out_layer = nn.Sequential(
                nn.Linear(50, out_size),
                nn.Sigmoid()
                )
        
    def forward(self, X):
        X = self.in_layer(X)
        X = self.net(X)
        X = self.out_layer(X)
        return X

class GoogleDriveDownloader():
    def __init__(self):
        pass

    def download(self, id, destination):
        print("Start Pre-trained Model Download")
        URL = "https://docs.google.com/uc?export=download"

        session = requests.Session()

        response = session.get(URL, params={'id': id}, stream=True)
        token = self.get_confirm_token(response)

        if token:
            params = {'id': id, 'confirm': token}
            response = session.get(URL, params=params, stream=True)

        self.save_response_content(response, destination)
        print("Finished Pre-trained Model Download")

    def get_confirm_token(self, response):
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                return value

        return None

    def save_response_content(self, response, destination):
        CHUNK_SIZE = 32768

        with open(destination, "wb") as f:
            for chunk in response.iter_content(CHUNK_SIZE):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)