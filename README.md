# QuantumShop - DevOps E-commerce Project

React, FastAPI, Node.js, Docker, Docker Compose and Kubernetes (Minikube) based demo e-commerce microservices project.

## Services
- Frontend: React + Vite
- Product: FastAPI (8000)
- Cart: Node.js + Express (3000)
- Payment: FastAPI demo (8001)
- Auth: FastAPI + SQLite (8002)

## Run
sudo docker compose up -d --build

## Kubernetes
minikube start --driver=docker
kubectl apply -f k8s/deployments.yaml
kubectl get pods
kubectl get services

Note: Payment is demo-only; no real payments are processed.
