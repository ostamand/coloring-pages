start:
	functions-framework --target daily_checks --signature-type http --port 8081
trigger:
	curl -X POST http://localhost:8081
format:
	black *.py