import socket
import threading
import time
import datetime
import Adafruit_DHT as dht
import json
import shelve
import os.path

HOST, PORT, URL = '', 8888, 'http://192.168.0.19:8888/'
def server_worker():
    listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_socket.bind((HOST, PORT))
    listen_socket.listen(1)
    print 'Serving HTTP on port %s ...' % PORT
    while True:
        client_connection, client_address = listen_socket.accept()
        request = client_connection.recv(1024)
        storagekey = ''
        values = []
        requestLines = request.split('\n')
        if(len(requestLines)>0):
            #print(request)
            print (requestLines[0])
            requestLines = requestLines[0].split( )
            if(len(requestLines)>1):
                storagekey = requestLines[1].replace('/','');
                path = 'files/'+storagekey+'.db'
                if(storagekey!='' and os.path.exists(path)):
                    datastore = shelve.open(path)
                    vklist = list(datastore.keys());
                    for vkey in vklist:
                        values.append(datastore[vkey])
        hr = 'HTTP/1.0 200 OK\r\n'
        hr = hr + 'Access-Control-Allow-Origin: *\r\n'
        hr = hr + 'Content-Type: application/json; charset=utf-8;\r\n'
        hr = hr + '\r\n'
        hr = hr + json.dumps(values)
        #print (hr)
        client_connection.sendall(hr)
        client_connection.close()

threads = []
t = threading.Thread(target=server_worker)
threads.append(t)
t.start()
