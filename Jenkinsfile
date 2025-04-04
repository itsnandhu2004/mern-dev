pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "nandhini1694/mern-backend:latest"
        FRONTEND_IMAGE = "nandhini1694/mern-frontend:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs()
                git branch: 'main', url: 'https://github.com/itsnandhu2004/mern-dev.git'
                echo "✅ Code successfully checked out!"
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('mern-todo-app-master/backend') {
                    sh "docker build -t ${BACKEND_IMAGE} -f Dockerfile ."
                }
                echo "✅ Backend Docker image built successfully!"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('mern-todo-app-master/frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE} -f Dockerfile ."
                }
                echo "✅ Frontend Docker image built successfully!"
            }
        }

        stage('Push Docker Images') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: '') {
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${FRONTEND_IMAGE}"
                }
                echo "✅ Docker images pushed to Docker Hub successfully!"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('k8s-manifests') {
                    withEnv(["KUBECONFIG=/var/lib/jenkins/.kube/config"]) {
                        sh """
                            kubectl apply -f backend-deployment.yaml
                            kubectl apply -f frontend-deployment.yaml
                        """
                    }
                }
                echo "🚀 Deployment to Kubernetes completed successfully!"
            }
        }

        stage('Wait for Frontend Service') {
            steps {
                withEnv(["KUBECONFIG=/var/lib/jenkins/.kube/config"]) {
                    script {
                        def minikubeIp = sh(script: "minikube ip", returnStdout: true).trim()
                        def nodePort = sh(script: "kubectl get svc frontend-service -o=jsonpath='{.spec.ports[0].nodePort}'", returnStdout: true).trim()

                        echo "🌐 Minikube IP: ${minikubeIp}"
                        echo "🔍 NodePort: ${nodePort}"

                        echo "⏳ Waiting for frontend to be available..."

                        // Retry curl until service is ready
                        def retries = 15
                        def delay = 5
                        def success = false

                        for (int i = 0; i < retries; i++) {
                            def status = sh(script: "curl -s --connect-timeout 2 http://${minikubeIp}:${nodePort} > /dev/null && echo OK || echo FAIL", returnStdout: true).trim()
                            if (status == "OK") {
                                success = true
                                break
                            }
                            echo "🔁 Service not ready yet. Retrying in ${delay}s..."
                            sleep time: delay, unit: 'SECONDS'
                        }

                        if (!success) {
                            error("❌ Frontend service did not become available in time.")
                        }

                        echo "✅ Frontend is available at: http://${minikubeIp}:${nodePort}"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def minikubeIp = sh(script: "minikube ip", returnStdout: true).trim()
                def nodePort = sh(script: "kubectl get svc frontend-service -o=jsonpath='{.spec.ports[0].nodePort}'", returnStdout: true).trim()
                echo "🎉 Deployment successful!"
                echo "🌍 Access your app at: http://${minikubeIp}:${nodePort}"
            }
        }
        failure {
            echo "❌ Build or deployment failed. Please check logs."
        }
    }
}